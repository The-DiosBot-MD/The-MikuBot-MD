import os from 'os';
import util from 'util';
import { exec } from 'child_process';
import v8 from 'v8';

const execPromise = util.promisify(exec);

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const clockString = (ms) => {
    let h = isNaN(ms) ? '▞▞' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '▞▞' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '▞▞' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join('::');
};

const getMemoryInfo = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const nodeUsage = process.memoryUsage();
    const v8Stats = v8.getHeapStatistics();

    return {
        total: formatBytes(totalMem),
        free: formatBytes(freeMem),
        used: formatBytes(usedMem),
        node: {
            rss: formatBytes(nodeUsage.rss),
            heapTotal: formatBytes(nodeUsage.heapTotal),
            heapUsed: formatBytes(nodeUsage.heapUsed),
            external: formatBytes(nodeUsage.external),
            arrayBuffers: formatBytes(nodeUsage.arrayBuffers),
        },
        v8Heap: {
            totalHeapSize: formatBytes(v8Stats.total_heap_size),
            usedHeapSize: formatBytes(v8Stats.used_heap_size),
            heapSizeLimit: formatBytes(v8Stats.heap_size_limit),
        }
    };
};

const getDiskSpace = async () => {
    try {
        const { stdout } = await execPromise('df -h');
        const lines = stdout.split('\n');
        const relevantLine = lines.find(line => line.startsWith('/dev/'));

        if (relevantLine) {
            const [filesystem, size, used, available, usePercent, mountedOn] = relevantLine.split(/\s+/).filter(Boolean);
            return {
                filesystem,
                size,
                used,
                available,
                usePercent,
                mountedOn
            };
        }
        return null;
    } catch (error) {
        console.error('⚠️ Error de disco:', error);
        return null;
    }
};

const handler = async (m, { conn }) => {
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = clockString(uptimeMs);
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();

    const memInfo = getMemoryInfo();
    const diskSpaceInfo = await getDiskSpace();

    let message = `╔═ ✦ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐃𝐄𝐋 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ✦ ═╗

╠═ ⚙️ 𝐇𝐎𝐒𝐓: ${hostname}
╠═ 🌐 𝐏𝐋𝐀𝐓𝐀𝐅𝐎𝐑𝐌𝐀: ${platform}
╠═ 🏛️ 𝐀𝐑𝐐𝐔𝐈𝐓𝐄𝐂𝐓𝐔𝐑𝐀: ${arch}
╠═ ⏱️ 𝐓𝐈𝐄𝐌𝐏𝐎 𝐀𝐂𝐓𝐈𝐕𝐎: ${uptimeFormatted}
╠═════════════════════════

╠═ 𝐌𝐄𝐌𝐎𝐑𝐈𝐀 𝐑𝐀𝐌
╠═ 💡 𝐓𝐎𝐓𝐀𝐋: ${memInfo.total}
╠═ 🍃 𝐋𝐈𝐁𝐑𝐄: ${memInfo.free}
╠═ ⚡ 𝐔𝐒𝐀𝐃𝐀: ${memInfo.used}
╠═════════════════════════

╠═ 𝐏𝐑𝐎𝐂𝐄𝐒𝐎 𝐍𝐎𝐃𝐄.𝐉𝐒
╠═ 📊 𝐑𝐒𝐒: ${memInfo.node.rss}
╠═ 📈 𝐇𝐄𝐀𝐏 𝐓𝐎𝐓𝐀𝐋: ${memInfo.node.heapTotal}
╠═ 📉 𝐇𝐄𝐀𝐏 𝐔𝐒𝐀𝐃𝐎: ${memInfo.node.heapUsed}
╠═ 🔗 𝐄𝐗𝐓𝐄𝐑𝐍𝐀: ${memInfo.node.external}
╠═ 🗂️ 𝐁𝐔𝐅𝐅𝐄𝐑𝐒: ${memInfo.node.arrayBuffers}
╠═════════════════════════

╠═ 𝐕𝟖 𝐇𝐄𝐀𝐏 𝐒𝐓𝐀𝐓𝐒
╠═ 🌟 𝐓𝐎𝐓𝐀𝐋 𝐇𝐄𝐀𝐏: ${memInfo.v8Heap.totalHeapSize}
╠═ 🌙 𝐔𝐒𝐄𝐃 𝐇𝐄𝐀𝐏: ${memInfo.v8Heap.usedHeapSize}
╠═ ⚙️ 𝐇𝐄𝐀𝐏 𝐋𝐈𝐌𝐈𝐓: ${memInfo.v8Heap.heapSizeLimit}
╠═════════════════════════
`;

    if (diskSpaceInfo) {
        message += `
╠═ 𝐒𝐏𝐀𝐂𝐄 𝐃𝐈𝐒𝐊
╠═ 📁 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐃𝐄 𝐀𝐑𝐂𝐇𝐈𝐕𝐎𝐒: ${diskSpaceInfo.filesystem}
╠═ 📌 𝐌𝐎𝐍𝐓𝐀𝐃𝐎 𝐄𝐍: ${diskSpaceInfo.mountedOn}
╠═ 📏 𝐓𝐀𝐌𝐀Ñ𝐎: ${diskSpaceInfo.size}
╠═ 💾 𝐔𝐒𝐀𝐃𝐎: ${diskSpaceInfo.used}
╠═ ✅ 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄: ${diskSpaceInfo.available}
╠═ 💯 𝐏𝐎𝐑𝐂𝐄𝐍𝐓𝐀𝐉𝐄: ${diskSpaceInfo.usePercent}
╚═════════════════════════
`;
    } else {
        message += `
╠═ 𝐒𝐏𝐀𝐂𝐄 𝐃𝐈𝐒𝐊
╠═ ❌ 𝐄𝐑𝐑𝐎𝐑 𝐀𝐋 𝐎𝐁𝐓𝐄𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 𝐃𝐄 𝐃𝐈𝐒𝐂𝐎.
╚═════════════════════════
`;
    }

    await conn.reply(m.chat, message.trim(), m);
};

handler.help = ['sistema'];
handler.tags = ['info'];
handler.command = ['system', 'sistema', 'stats', 'estado', 'info'];
handler.register = true;

export default handler;
