export const mailData = {
  id: '5bfbfc3146e0fb321rsa4b28',
  creator_id: '5bfbfc3146e0fb321rsa4b28',
  aws_message_id: '5bfbfc3146e0fb321rsa4b28',
  subject: 'string',
  recipients: {
    to: ['someone@someplace.com'],
    cc: ['someone@someplace.com'],
    bcc: ['someone@someplace.com'],
  },
  template_id: '5bfbfc3146e0fb321rsa4b28',
  reply_to: ['someone@someplace.com'],
  from: 'someone@someplace.com',
  body: 'string',
  language: 'NL',
  content: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {},
  },
  views: 0,
  creation_timestamp: 0,
  update_timestamp: 0,
};

export const mailsResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [mailData],
};

export const mailInput = {
  templateId: '5bfbfc3146e0fb321rsa4b28',
  content: {
    firstTemplateField: 1,
    secondField: 'two',
  },
  language: 'NL',
  recipients: {
    to: ['someone@someplace.com'],
    cc: ['someone@someplace.com'],
    bcc: ['someone@someplace.com'],
  },
  from: 'someone@someplace.com',
  replyTo: ['someone@someplace.com'],
  attachments: [
    {
      name: 'report.pdf',
      content: 'SGVsbG8gZGFya25lc3MgbXkgb2xkIGZyaWVuZA==',
      type: 'application/pdf',
    },
  ],
};

export const queuedMailData = {
  id: '5bfbfc3146e0fb321rsa4b28',
  status: 'queued',
  from: 'string',
  to: ['someone@someplace.com'],
  cc: ['someone@someplace.com'],
  bcc: ['someone@someplace.com'],
  replyTo: 'someone@someplace.com',
  subject: 'string',
  text: 'string',
  html: 'string',
  attachments: [
    {
      filename: 'string',
      content: 'string',
      encoding: 'string',
    },
  ],
  encoding: 'string',
  textEncoding: 'string',
  templateData: {
    templateId: '5bfbfc3146e0fb321rsa4b28',
    credentials: {
      serviceId: '5bfbfc3146e0fb321rsa4b28',
      applicationId: '5bfbfc3146e0fb321rsa4b28',
      userId: '5bfbfc3146e0fb321rsa4b28',
    },
    language: 'NL',
    content: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
  },
};

export const queuedMailsResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [queuedMailData],
};
