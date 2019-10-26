'use strict';

const debug = require('debug')('mozilla-syncfest-campaign:lib:formHandling');
const uuidv4 = require('uuid/v4');
const { IncomingForm } = require('formidable');

const fieldDefinition = require('../field_config.json');

const MULTIPLE_DEVICES_REGEX = /multiple-devices/;
const MULTIPLE_REGEX = /multiple-/;
const MULTIPLE_FIELD_NAME_REGEX = /^\d+-(multiple-.*)/;

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

        const { otherFields, multipleDevicesFields } = Object.entries(formFields).reduce((acc, fieldValues) => {
          const preparedField = prepareField(fieldValues);

          if (MULTIPLE_DEVICES_REGEX.test(fieldValues[0])) {
            acc['multipleDevicesFields'].push(preparedField);
            return acc;
          }

          acc['otherFields'].push(preparedField);
          return acc;
        }, {
          otherFields: [],
          multipleDevicesFields: [],
        });

        const sortedFields = otherFields.sort(sortByConfigId);
        const sortedMultipleFields = multipleDevicesFields.sort(sortByName);
        const allFields = sortedFields.concat(sortedMultipleFields);
        resolve(allFields);
      });
  });
}

function validateFields(formFields) {
  return Object.keys(fieldDefinition).every((fieldKey) => {
    if (MULTIPLE_REGEX.test(fieldKey)) {
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

function prepareField([fieldKey, fieldContent]) {
  let configurationFieldKey = getConfigurationFieldKey(fieldKey);

  return {
    name: fieldKey,
    text: fieldContent,
    config: fieldDefinition[configurationFieldKey],
  };
}

function getConfigurationFieldKey(fieldKey) {
  if (MULTIPLE_REGEX.test(fieldKey)) {
    const fieldNameMatch = fieldKey.match(MULTIPLE_FIELD_NAME_REGEX);
    const configurationFieldKey = fieldNameMatch && fieldNameMatch.length > 1 && fieldNameMatch[1];
    return configurationFieldKey;
  }

  return fieldKey;
}

function sortByConfigId(a, b) {
  return a.config.id - b.config.id;
}

function sortByName(a, b) {
  return a.name - b.name;
}