'use strict';

const debug = require('debug')('mozilla-syncfest-campaign:lib:formHandling');
const uuidv4 = require('uuid/v4');
const { IncomingForm } = require('formidable');

const fieldDefinition = require('../field_config.json');

module.exports = {
  parseForm,
};

function parseForm(req) {
  const form = new IncomingForm();

  return new Promise((resolve, reject) => {
    const formFields = {};
    const uniqueName = uuidv4();

    form.parse(req)
      .on('fileBegin', (name, file) => {
        if (!file.name) {
          return;
        }

        debug('INCOMING_REQUEST_FILE_BEGIN', file.name, file.type);
        file.extension = file.type && file.type.includes('/') && file.type.split('/')[1];
        file.path = `${__dirname}/../public/screenshots/${uniqueName}.${file.extension}`;
      })
      .on('field', (name, field) => {
        debug('INCOMING_REQUEST_FIELD', name, field);

        if (name === 'github' && field && !field.startsWith('@')) {
          field = `@${field}`;
        }

        formFields[name] = field;
      })
      .on('file', (name, file) => {
        if (!file.name) {
          return;
        }

        debug('INCOMING_REQUEST_FILE', name, file.path);
        formFields[name] = `${uniqueName}.${file.extension}`;
      })
      .on('aborted', () => {
        debug('INCOMING_REQUEST_ABORTED');
      })
      .on('error', (err) => {
        debug('INCOMING_REQUEST_ERROR', err);
        reject(err);
      })
      .on('end', () => {
        const allFieldsValidated = validateFields(formFields);
        if (!allFieldsValidated) {
          return reject(new Error('VALIDATION_FAILED'));
        }

        const preparedFields = prepareFieldsToArray(formFields);
        const sortedFields = preparedFields.sort(sortByConfigId);
        resolve(sortedFields);
      });
  });
}

function validateFields(formFields) {
  return Object.keys(fieldDefinition).every((fieldKey) => {
    if (fieldKey.startsWith('multiple')) {
      return true;
    }

    let definition = fieldDefinition[fieldKey];

    if (!definition) {
      console.error('NO_DEFINITION_FOUND_FOR', fieldKey);
      return false;
    }

    if (definition.required && !formFields[fieldKey]) {
      return false;
    }

    const regex = new RegExp(definition.pattern, 'i');
    if (!regex.test(formFields[fieldKey])) {
      return false;
    }

    return true;
  });
}

function prepareFieldsToArray(formFields) {
  return Object.keys(formFields).map((fieldKey) => {
    let configurationFieldKey = fieldKey;
    if (fieldKey.startsWith('multiple-')) {
      const fieldNameMatch = fieldKey.match(/^(multiple-.*)-\d+/);
      configurationFieldKey = fieldNameMatch.length > 1 && fieldNameMatch[1];
    }

    return {
      name: fieldKey,
      text: formFields[fieldKey],
      config: fieldDefinition[configurationFieldKey],
    };
  });
}

function sortByConfigId(a, b) {
  return a.config.id - b.config.id;
}