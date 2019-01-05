const TableOfContents = {
  id: '1',
  content: [
    {
      sectionName: 'Home',
      path: '/',
      content: 'home.md',
      icon: 'file',
      access: 'default',
    },
    {
      sectionName: 'Getting Started',
      path: '/getting-started',
      content: 'gettingStarted.md',
      icon: 'file',
      access: 'default',
    },
    {
      sectionName: 'Format',
      path: '/format',
      content: [
        {
          sectionName: 'JSON',
          path: '/format/json',
          content: 'json.md',
          icon: '',
          access: 'default',
        },
      ],
      icon: 'file',
      access: 'default',
    },
    {
      sectionName: 'Sidebar Nav',
      path: '/sidebar',
      content: [
        {
          sectionName: 'Nesting',
          path: '/sidebar/nesting',
          content: 'nesting.md',
          icon: '',
          access: 'default',
        },
      ],
      icon: 'file',
      access: 'default',
    },
  ],
};

module.exports = TableOfContents;
