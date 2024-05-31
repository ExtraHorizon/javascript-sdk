import nock from 'nock';
import { createClient } from '../../../../src';
import { FILES_BASE } from '../../../../src/constants';

describe('Files - Settings - PUT', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Updates the File Service Settings', async () => {
    nock(`${host}${FILES_BASE}`)
      .put(`/settings`)
      .reply(200, { affectedRecords: 1 });

    const response = await exh.files.settings.update({
      disableForceDownloadForMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/gif',
      ],
    });

    expect(response).toMatchObject({ affectedRecords: 1 });
  });
});
