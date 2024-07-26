import { Manager, User } from '@itsmybot';
import { GuildMember } from 'discord.js';

export default class UserService {
  manager: Manager;

  constructor(manager: Manager) {
    this.manager = manager;

    this.manager.services.database.sequelize.addModels([User]);
    User.sync({ alter: true });
  }

  async initialize() {
    this.manager.logger.info("User service initialized.");
  }

  async findOrNull(userId: string): Promise<User | null> {
    return User.findOne({ where: { id: userId } });
  }

  async find(userId: string): Promise<User> {
    const user = await this.findOrNull(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async findOrCreate(member: GuildMember): Promise<User> {
    const user = await this.findOrNull(member.id);
    if (user) return this.updateInfo(user, member);

    const userData = {
      id: member.id,
      username: member.user.username,
      displayName: member.user.displayName,
      avatar: member.user.avatarURL(),
      createdAt: Math.round(member.user.createdTimestamp / 1000),
      joinedAt: member.joinedTimestamp ? Math.round(member.joinedTimestamp / 1000) : undefined,
      roles: member.roles.cache
        .filter(r => r.id != member.guild.roles.everyone.id)
        .map(r => r.id),
    };

    return User.create(userData);
  }

  async updateInfo(user: User, member: GuildMember) {
    const userData = {
      username: member.user.username,
      displayName: member.user.displayName,
      avatar: member.user.avatarURL() || user.avatar,
      joinedAt: member.joinedTimestamp ? Math.round(member.joinedTimestamp / 1000) : user.joinedAt,
      roles: member.roles.cache
        .filter(r => r.id != member.guild.roles.everyone.id)
        .map(r => r.id),
    };

    await user.update(userData);
    await user.save();
    return user;
  }
}
