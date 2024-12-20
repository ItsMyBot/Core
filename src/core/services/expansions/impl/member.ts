import { Context } from "@contracts";
import { Expansion } from "../expansion.js";

export default class MemberExpansion extends Expansion {
    name = 'member';

    async onRequest(context: Context, placeholder: string) {
        if (!context.member) return

        switch (placeholder) {
            case 'display_name':
                return context.member.displayName;
            case 'server_avatar_url':
                return (context.member.avatarURL() !== null && context.member.avatarURL() !== context.member.user.avatarURL()) ? context.member.avatarURL({ forceStatic: true }) : null;
            case 'global_avatar':
                return context.member.user.avatarURL;
            case 'timed_out_until_date':
                return context.member.isCommunicationDisabled() ? context.member.communicationDisabledUntil : null;
            case 'timed_out_until_timestamp':
                return context.member.isCommunicationDisabled() ? context.member.communicationDisabledUntilTimestamp : null;
            case 'joined_at_date':
                return context.member.joinedAt;
            case 'joined_at_timestamp':
                return context.member.joinedTimestamp;
            case 'pending_membership':
                return context.member.pending;
            case 'server_booster':
                return context.member.premiumSince !== null ? true : false;
            case 'server_booster_since_date':
                return context.member.premiumSince;
            case 'server_booster_since_timestamp':
                return context.member.premiumSinceTimestamp;
            case 'user_status':
                return context.member.presence?.status;
        }
    }
}