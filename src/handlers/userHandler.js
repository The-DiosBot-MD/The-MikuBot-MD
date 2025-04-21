import { userManager } from '../database/userManager.js';

export class UserHandler {
constructor() {
this.userManager = userManager
}

// Registrar nuevo usuario
async registerUser(platformData) {
const userData = {
platform: platformData.platform,
name: platformData.name || 'Usuario Anónimo',
registrationDate: new Date().toISOString(),
stats: {
coins: 20,
exp: 0,
level: 1,
commandsUsed: 0
},
preferences: {
language: 'es',
notifications: true
}}

        return await this.userManager.createUser(userData);
    }

    // Obtener información de usuario
    async getUserInfo(userId) {
        return await this.userManager.getUserById(userId);
    }

    // Actualizar estadísticas de usuario
    async updateUserStats(userId, statsUpdate) {
        const currentUser = await this.getUserInfo(userId);
        
        if (!currentUser) {
            throw new Error('Usuario no encontrado');
        }

        const updatedStats = {
            ...currentUser.stats,
            ...statsUpdate,
            coins: (currentUser.stats.coins || 0) + (statsUpdate.coins || 0),
            exp: (currentUser.stats.exp || 0) + (statsUpdate.exp || 0),
            commandsUsed: (currentUser.stats.commandsUsed || 0) + 1
        };

        return await this.userManager.updateUser(userId, { stats: updatedStats });
    }
}

export const userHandler = new UserHandler();
