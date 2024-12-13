import { Collection } from 'discord.js';
import { Action, ActionData, Plugin } from '@itsmybot';

import AddReactionAction from './impl/addReaction.js';
import AddRoleAction from './impl/addRole.js';
import DeleteMessageAction from './impl/deleteMessage.js';
import PinMessageAction from './impl/pinMessage.js';
import RemoveReactionAction from './impl/removeReaction.js';
import RemoveRoleAction from './impl/removeRole.js';
import ReplyAction from './impl/reply.js';
import SendMessageAction from './impl/sendMessage.js';
import SendPrivateMessageAction from './impl/sendPrivateMessage.js';
import StartThreadAction from './impl/startThread.js';
import UnpinMessageAction from './impl/unpinMessage.js';

import { Context, Variable } from '@contracts';
import EngineService from '../engineService.js';

export class ActionHandler {
  engine: EngineService;
  actions: Collection<string, Action<Plugin | undefined>>;

  constructor(engine: EngineService) {
    this.engine = engine;
    this.actions = new Collection();
  }

  registerAction(id: string, action: Action<Plugin | undefined>) {
    if (this.actions.has(id)) return action.logger.warn(`Action ${id} is already registered`);

    this.actions.set(id, action);
  }

  async triggerAction(script: ActionData, context: Context, variables: Variable[] = []) {
    if (!script.id) return script.logger.error("No action ID found in script");

    const actionInstance = this.actions.get(script.id);
    if (!actionInstance) return script.logger.warn(`No action found for ID: ${script.id}`);

    actionInstance.trigger(script, context, variables);
  }

  initialize() {
    this.registerAction("addReaction", new AddReactionAction(this.engine.manager));
    this.registerAction("addRole", new AddRoleAction(this.engine.manager));
    this.registerAction("deleteMessage", new DeleteMessageAction(this.engine.manager));
    this.registerAction("pinMessage", new PinMessageAction(this.engine.manager));
    this.registerAction("removeReaction", new RemoveReactionAction(this.engine.manager));
    this.registerAction("removeRole", new RemoveRoleAction(this.engine.manager));
    this.registerAction("reply", new ReplyAction(this.engine.manager));
    this.registerAction("sendMessage", new SendMessageAction(this.engine.manager));
    this.registerAction("sendPrivateMessage", new SendPrivateMessageAction(this.engine.manager));
    this.registerAction("startThread", new StartThreadAction(this.engine.manager));
    this.registerAction("unpinMessage", new UnpinMessageAction(this.engine.manager));
  }
}