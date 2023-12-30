export const Tag = Object.freeze({
  TAGS_MADE_BY_USER: 0,
  TAGGED_USERS: 1,
});

export const getTagName = (type = Tag.TAGS_MADE_BY_USER) => {
  switch (type) {
    case Tag.TAGS_MADE_BY_USER:
      return "Tags Sent By User";
    case Tag.TAGGED_USERS:
      return "Tags Received For User";
    default:
      return "";
  }
};
