import inquirer from 'inquirer';

export const select = async (message, options) => {
  const { value } = await inquirer.prompt([{
    type: 'list',
    name: 'value',
    loop: false,
    message,
    choices: options,
    pageSize: 10
  }]);

  return value;
}

export const input = async (message) => {
  const { value } = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message,
  }]);
  return value;
}

export default { input, select };