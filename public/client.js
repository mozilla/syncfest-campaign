'use strict';

let devicesIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  const devices = document.querySelector('#devices');
  addDeviceFormFields(devices);

  const addDeviceButton = document.querySelector('#add-device');
  addDeviceButton.addEventListener('click', () => {
    addDeviceFormFields(devices);
  });
});

function addDeviceFormFields(container) {
  const osContainer = document.createElement('div');
  osContainer.classList.add('input-group');

  const osLabel = document.createElement('label');
  const osKey = `multiple-devicesOS-${devicesIndex}`;
  osLabel.setAttribute('for', osKey);
  osLabel.setAttribute('name', osKey);
  osLabel.setAttribute('required', true);
  osLabel.textContent = `Device ${devicesIndex + 1} - Operating System`;

  const requiredSpan = document.createElement('span');
  requiredSpan.innerHTML = '&nbsp;*';
  osLabel.appendChild(requiredSpan);

  osContainer.appendChild(osLabel);

  const osSelect = document.createElement('select');
  osSelect.setAttribute('id', osKey);
  osSelect.setAttribute('name', osKey);
  osSelect.setAttribute('required', true);

  const initialOption = document.createElement('option');
  initialOption.setAttribute('value', '');
  initialOption.setAttribute('selected', true);
  initialOption.setAttribute('disabled', true);
  initialOption.textContent = 'Please select your Operating System';

  const option1 = document.createElement('option');
  option1.setAttribute('value', 'Desktop - Windows');
  option1.textContent = 'Desktop - Windows';
  const option2 = document.createElement('option');
  option2.setAttribute('value', 'Desktop - macOS');
  option2.textContent = 'Desktop - macOS';
  const option3 = document.createElement('option');
  option3.setAttribute('value', 'Desktop - Linux');
  option3.textContent = 'Desktop - Linux';
  const option4 = document.createElement('option');
  option4.setAttribute('value', 'Phone - Android');
  option4.textContent = 'Phone - Android';
  const option5 = document.createElement('option');
  option5.setAttribute('value', 'Phone - iOS');
  option5.textContent = 'Phone - iOS';
  const option6 = document.createElement('option');
  option6.setAttribute('value', 'Phone - Other');
  option6.textContent = 'Phone - Other';
  const option7 = document.createElement('option');
  option7.setAttribute('value', 'Tablet - Android');
  option7.textContent = 'Tablet - Android';
  const option8 = document.createElement('option');
  option8.setAttribute('value', 'Tablet - iOS');
  option8.textContent = 'Tablet - iOS';
  const option9 = document.createElement('option');
  option9.setAttribute('value', 'Tablet - Other');
  option9.textContent = 'Tablet - Other';

  osSelect.appendChild(initialOption);
  osSelect.appendChild(option1);
  osSelect.appendChild(option2);
  osSelect.appendChild(option3);
  osSelect.appendChild(option4);
  osSelect.appendChild(option5);
  osSelect.appendChild(option6);
  osSelect.appendChild(option7);
  osSelect.appendChild(option8);
  osSelect.appendChild(option9);

  osContainer.appendChild(osSelect);

  container.appendChild(osContainer);

  const versionContainer = document.createElement('div');
  versionContainer.classList.add('input-group');

  const versionLabel = document.createElement('label');
  const versionKey = `multiple-devicesVersion-${devicesIndex}`;
  versionLabel.setAttribute('for', versionKey);
  versionLabel.textContent = `Device ${devicesIndex + 1} - Firefox Version`;

  const requiredVersionSpan = document.createElement('span');
  requiredVersionSpan.innerHTML = '&nbsp;*';
  versionLabel.appendChild(requiredVersionSpan);

  versionContainer.appendChild(versionLabel);

  const versionInput = document.createElement('input');
  versionInput.setAttribute('id', versionKey);
  versionInput.setAttribute('name', versionKey);
  versionInput.setAttribute('type', 'text');
  versionInput.setAttribute('required', true);

  versionContainer.appendChild(versionInput);

  container.appendChild(versionContainer);

  devicesIndex = devicesIndex + 1;
}
