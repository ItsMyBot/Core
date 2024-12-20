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
                return ((context.member.avatarURL() !== null && context.member.avatarURL() !== context.member.user.avatarURL()) ? context.member.avatarURL({ forceStatic: true }) : null) || undefined;
            case 'global_avatar':
                return context.member.user.avatarURL() || undefined;
            case 'timed_out_until_date':
                return (context.member.isCommunicationDisabled() ? context.member.communicationDisabledUntil.toDateString() : null) || undefined;
            case 'timed_out_until_timestamp':
                return (context.member.isCommunicationDisabled() ? context.member.communicationDisabledUntilTimestamp.toString() : null) || undefined;
            case 'joined_at_date':
                return context.member.joinedAt?.toDateString() || undefined;
            case 'joined_at_timestamp':
                return context.member.joinedTimestamp?.toString() || undefined;
            case 'pending_membership':
                return context.member.pending ? 'true' : 'false';
            case 'server_booster':
                return context.member.premiumSince !== null ? 'true' : 'false';
            case 'server_booster_since_date':
                return context.member.premiumSince?.toDateString();
            case 'server_booster_since_timestamp':
                return context.member.premiumSinceTimestamp?.toString();
            case 'user_status':
                return context.member.presence?.status;
        }
    }
}