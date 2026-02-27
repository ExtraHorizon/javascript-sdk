import { parseGlobalPermissions } from '../../src';

const permissionsObject = {
  good: ['VIEW_DOCUMENTS'],
  bad: ['BAD_PERMISSION'],
};
describe('parseGlobalPermissions', () => {
  it('Parses successfully', async () => {
    expect(parseGlobalPermissions(permissionsObject.good)).toHaveLength(1);
  });

  it('Parses with empty array and warning', async () => {
    jest.spyOn(global.console, 'warn');
    expect(parseGlobalPermissions(permissionsObject.bad)).toHaveLength(0);
    expect(console.warn).toBeCalled();
  });
});
