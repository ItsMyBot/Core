import { Collection } from 'discord.js';
import { Action, ActionScript, Manager } from '@itsmybot';

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

export class ActionHandler {
  manager: Manager;
  actions: Collection<string, Action>;

  constructor(manager: Manager) {
    this.manager = manager;
    this.actions = new Collection();
  }

  registerAction(id: string, action: Action) {
    if (this.actions.has(id)) return action.logger.warn(`Action ${id} is already registered`);

    this.actions.set(id, action);
  }

  async triggerAction(script: ActionScript, context: Context, variables: Variable[] = []) {
    if (!script.id) return this.manager.logger.error("No action ID found in script");

    const actionInstance = this.actions.get(script.id);
    if (!actionInstance) return this.manager.logger.warn(`No action found for ID: ${script.id}`);

    const actionParameters = actionInstance.parameters().filter((param: string) => !(param in context));
    for (const param of actionParameters) {
      return this.manager.logger.error(`${script.id} need the parameter '${param}'`);
    }

    const actionArguments = actionInstance.arguments().filter((arg: string) => !script.args.has(arg));
    for (const arg of actionArguments) {
      return this.manager.logger.error(`${script.id} need the argument '${arg}'`);
    }

    actionInstance.trigger(script, context, variables);
  }

  initialize() {
    this.registerAction("addReaction", new AddReactionAction(this.manager));
    this.registerAction("addRole", new AddRoleAction(this.manager));
    this.registerAction("deleteMessage", new DeleteMessageAction(this.manager));
    this.registerAction("pinMessage", new PinMessageAction(this.manager));
    this.registerAction("removeReaction", new RemoveReactionAction(this.manager));
    this.registerAction("removeRole", new RemoveRoleAction(this.manager));
    this.registerAction("reply", new ReplyAction(this.manager));
    this.registerAction("sendMessage", new SendMessageAction(this.manager));
    this.registerAction("sendPrivateMessage", new SendPrivateMessageAction(this.manager));
    this.registerAction("startThread", new StartThreadAction(this.manager));
    this.registerAction("unpinMessage", new UnpinMessageAction(this.manager));
  }
}