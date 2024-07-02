import nock from 'nock';
import { createClient } from '../../../../src';
import { FILES_BASE } from '../../../../src/constants';

describe('Files - Settings - GET', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  const settingsResponse = {
    disableForceDownloadForMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
    updateTimestamp: '2023-08-02T13:53:43.975Z',
  };

  it('Retrieves the File Service Settings', async () => {
    nock(`${host}${FILES_BASE}`)
      .get(`/settings`)
      .reply(200, { ...settingsResponse });

    const settings = await exh.files.settings.get();
    expect(settings).toMatchObject({
      disableForceDownloadForMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/gif',
      ],
      updateTimestamp: new Date('2023-08-02T13:53:43.975Z'),
    });
  });
});
