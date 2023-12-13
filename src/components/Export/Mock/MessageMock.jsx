import React from "react";
import { Stack, Typography } from "@mui/material";
import ExportStyles from "../Styles/Export.styles";
import AttachmentMock from "./AttachmentMock";
import AuthorAvatar from "./AuthorAvatar";
import EmbedMock from "./EmbedMock";
import classNames from "classnames";
import { format, parseISO } from "date-fns";
import { selectChannel } from "../../../features/channel/channelSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGuild } from "../../../features/guild/guildSlice";
import { selectMessage } from "../../../features/message/messageSlice";
import { selectThread } from "../../../features/thread/threadSlice";
import {
  getFormattedInnerHtml,
  selectExport,
} from "../../../features/export/exportSlice";
import { getTimeZone } from "../../../utils";
import CheckIcon from "@mui/icons-material/Check";
import WebhookEmbedMock from "./WebhookEmbedMock";

const MessageMock = ({ message, index, browserView = false }) => {
  const dispatch = useDispatch();
  const { selectedGuild } = useSelector(selectGuild);
  const { selectedChannel, channels } = useSelector(selectChannel);
  const { threads } = useSelector(selectThread);
  const { messages } = useSelector(selectMessage);
  const { exportMaps } = useSelector(selectExport);
  const { userMap } = exportMaps;

  const classes = ExportStyles();
  const messageDate = parseISO(message.timestamp, new Date());
  const tz = getTimeZone(messageDate);
  const foundThread = threads?.find(
    (thread) => thread.id === message.id || thread.id === message.channel_id
  );
  const repliedToMsg = message.isReply()
    ? messages.find((msg) => msg.id === message.message_reference.message_id)
    : null;

  const showChannelName = selectedGuild.id && !selectedChannel.id;

  const getAuthorName = (msg) => {
    const author = msg.getAuthor();

    const guildRoles =
      userMap[author.getUserId()]?.guilds[selectedGuild.getId()]?.roles || [];

    const { colorRole, iconRole } =
      selectedGuild.getHighestRoles(guildRoles) || {};

    return (
      <>
        <strong
          title={author.getUserName()}
          style={{ color: colorRole && colorRole.getColor() }}
        >
          {author.getDisplayName() || author.getUserName()}
        </strong>
        {Boolean(iconRole) && (
          <img
            title={iconRole.getName()}
            className={classes.roleIconImg}
            src={iconRole.getIconUrl()}
            alt="role-icon"
          />
        )}
        {!Boolean(iconRole) && msg.getAuthor().isBot() && (
          <span title="Verified Bot" className={classes.botTag}>
            <CheckIcon /> BOT
          </span>
        )}
      </>
    );
  };

  const getMessageContent = (content, id, isReply = false) => {
    let rawHtml = dispatch(
      getFormattedInnerHtml(content, isReply, !browserView)
    );
    return (
      <Typography
        id={id}
        variant={isReply ? "caption" : "body1"}
        className={classNames(classes.messageContent, {
          [classes.typographyMessageText]: !isReply,
          [classes.replyMessageText]: isReply,
        })}
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    );
  };

  const getRepliedToContent = () => {
    return (
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={1}
      >
        <div className={classes.replyDiv} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
          sx={{ maxWidth: 600 }}
        >
          <AuthorAvatar
            browserView={browserView}
            message={repliedToMsg}
            reply
          />
          <Typography
            className={classNames(
              classes.authorNameParent,
              classes.replyMessageName
            )}
            variant="caption"
          >
            {browserView ? (
              getAuthorName(repliedToMsg)
            ) : (
              <a href={`#${repliedToMsg.id}`}>{getAuthorName(repliedToMsg)}</a>
            )}
          </Typography>
          {getMessageContent(repliedToMsg.content, `reply-data-${index}`, true)}
        </Stack>
      </Stack>
    );
  };

  const getChannelName = () => {
    return (
      <Typography
        variant="caption"
        mt="1px"
        className={classNames(classes.channelName, classes.typographyTitle)}
      >
        {
          channels.find((channel) => channel.id === message.getChannelId())
            ?.name
        }
      </Typography>
    );
  };

  const getThread = () => {
    return (
      <Typography variant="caption" className={classes.typographyHash}>
        {foundThread.name}
      </Typography>
    );
  };

  const getAttachments = () => {
    return (
      <Stack
        mt="5px"
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        {message.getAttachments().map((attachment) => (
          <AttachmentMock attachment={attachment} />
        ))}
        {message.getEmbeds().map((embed, index) => (
          <EmbedMock embed={embed} index={index} />
        ))}
      </Stack>
    );
  };

  const getRichEmbeds = () => {
    return (
      <Stack
        sx={{ maxWidth: "600px" }}
        mt="5px"
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        {message?.getRichEmbeds().map((embed) => (
          <WebhookEmbedMock alwaysExpanded={true} embed={embed} />
        ))}
      </Stack>
    );
  };

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      id={message.id}
      className={classes.mockStack}
    >
      {repliedToMsg && getRepliedToContent()}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={1}
        className={classes.messageMockMainStack}
      >
        <AuthorAvatar browserView={browserView} message={message} />
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Typography
              className={classNames(
                classes.authorNameParent,
                classes.typographyTitle
              )}
              variant="body2"
            >
              {getAuthorName(message)}
            </Typography>
            <Typography
              mt="1px"
              className={classes.typographyHash}
              variant="caption"
            >
              {`${format(messageDate, "MM/dd/yyyy")} at ${format(
                messageDate,
                "HH:mm:ss"
              )} ${tz}`}
            </Typography>
            {showChannelName && getChannelName()}
          </Stack>
          {foundThread && getThread()}
          {getMessageContent(message.content, `message-data-${index}`)}
          {!browserView && getAttachments()}
          {!browserView && getRichEmbeds()}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default MessageMock;
