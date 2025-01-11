import { VoiceState } from 'discord.js';
import { Events } from '@contracts';
import { Event } from '@itsmybot';

export default class VoiceStateUpdateEvent extends Event {
    name = Events.VoiceStateUpdate;
    priorty: 0;

    async execute(oldState: VoiceState, newState: VoiceState) {
        if (oldState.channel) {
            this.manager.client.emit(Events.VoiceLeave, oldState);
        }
        
        if (newState.channel) {
            this.manager.client.emit(Events.VoiceJoin, newState);
        }
    }
}