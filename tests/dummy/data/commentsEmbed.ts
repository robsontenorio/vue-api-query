export const Comments = {
  data: [
    {
      id: 1,
      post_id: 1,
      someId: 'ma018-9ha12',
      text: 'Hello',
      replies: {
        data: [
          {
            id: 3,
            comment_id: 1,
            someId: 'ma020-9ha15',
            text: 'Hello',
          }
        ]
      }
    },
    {
      id: 2,
      post_id: 1,
      someId: 'mw012-7ha19',
      text: 'How are you?',
      replies: {
        data: [
          {
            id: 4,
            comment_id: 2,
            someId: 'mw023-9ha18',
            text: 'Hello',
          },
          {
            id: 5,
            comment_id: 2,
            someId: 'mw035-0ha22',
            text: 'Hello',
          }
        ]
      }
    }
  ]
}
