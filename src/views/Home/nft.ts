import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@dfinity/principal/lib/cjs/utils/getCrc';
import { sha224 } from '@dfinity/principal/lib/cjs/utils/sha224';
import type { Identity } from '@dfinity/agent';
import { Actor, Agent, HttpAgent, HttpAgentOptions } from '@dfinity/agent';
import { idlFactory } from './nft.did';
import { _SERVICE } from './nft.did.d';

export const createExperienceWorkerActor = (
    canisterId: string | Principal,
    options?: { agentOptions?: HttpAgentOptions; actorOptions?: { agent: Agent } },
): _SERVICE => {
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        ...options?.agentOptions,
    });

    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};

export const createAuditActor = (
    canisterId: string | Principal,
    options?: { agentOptions?: HttpAgentOptions; actorOptions?: { agent: Agent } },
): _SERVICE => {
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        ...options?.agentOptions,
    });

    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};


export const getActorByAgent = (canister_id: string, agent: Agent) => {
    return createExperienceWorkerActor(canister_id, {
        actorOptions: { agent },
    });
};

export const getActor = (canister_id: string, identity?: Identity) => {
    return createAuditActor(
        canister_id,
        identity ? { agentOptions: { identity } } : undefined,
    );
};


export const handleIdentityAgent = (identity: Identity) => {
    return new HttpAgent({ identity, host: 'https://ic0.app' });
};

export const to32bits = (num: number) => {
    const b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};

export const get_sub_account_array = (index: any) => {
    return new Uint8Array(Array(28).fill(0).concat(to32bits(index)));
};

export const addCrc32 = (buf: any) => {
    const crc32Buf = Buffer.alloc(4);
    crc32Buf.writeUInt32BE(getCrc32(buf), 0);
    return Buffer.concat([crc32Buf, buf]);
};

export const get_account_id = (principal: string, id = 0): string => {
    const subAccount = Buffer.from(get_sub_account_array(id));
    const acc_buf = Buffer.from('\x0Aaccount-id');
    const pri_buf = Buffer.from(Principal.fromText(principal).toUint8Array());

    const buff = Buffer.concat([acc_buf, pri_buf, subAccount]);

    const sha = sha224(buff);
    const aId = Buffer.from(sha);

    return addCrc32(aId).toString('hex');
};