<template>
  <div class="input">
    <input class="pid" v-model="pid" placeholder="PID" />
    <p class='btn' @click="getNft">开始请求</p>
  </div>
  <p v-if="endTime">用时: {{ (endTime - startTime) / 1000 }}</p>
  <div class="list">
    <div class="item" v-for="item in ntfList" :key="item.nftLength">
      <p>{{ item.canisterId }}</p>
      <p>数量: {{ item.nftLength }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { get_account_id, getActor } from './nft';
import { AuthClient } from '@dfinity/auth-client';
import type { Identity } from '@dfinity/agent';
import { Agent } from '@dfinity/agent';

const canister_arr = [
  '66orv-hqaaa-aaaah-acmnq-cai',
  'algz6-lqaaa-aaaap-aakza-cai',
  'zdxun-dyaaa-aaaap-aa3ma-cai',
  'tajq6-syaaa-aaaap-aaw3a-cai',
  '5btbh-2aaaa-aaaap-aaqga-cai',
  'jx6g3-miaaa-aaaap-aamwa-cai',
  'shkzf-7iaaa-aaaah-addwq-cai',
  '47moi-iqaaa-aaaap-aa3tq-cai',
  '3hzxy-fyaaa-aaaap-aaiiq-cai',
  '355dh-iiaaa-aaaap-aa46q-cai',
  'qv3zw-kqaaa-aaaap-aa27q-cai',
  'qekxn-6yaaa-aaaap-aa5bq-cai',
  'r6vtw-7iaaa-aaaap-aaoma-cai',
  'n5yqx-uqaaa-aaaap-aatja-cai',
  // 'ft6xr-taaaa-aaaam-aafmq-cai',
  '7hbq5-xyaaa-aaaah-abxsa-cai',
  'vupsp-fyaaa-aaaah-abjpq-cai',
  '4ibzi-eaaaa-aaaah-abqfa-cai',
  'fx5d3-ayaaa-aaaap-aakgq-cai',
  'gkhkc-5yaaa-aaaah-abvoa-cai',
  'w3tmp-uiaaa-aaaap-aawea-cai',
  'swu4x-biaaa-aaaap-aaj3q-cai',
  '6enz3-daaaa-aaaah-abxuq-cai',
  'nn6cu-rqaaa-aaaap-aa7ga-cai',
  'utve7-eaaaa-aaaah-abouq-cai',
  'goncb-kqaaa-aaaap-aakpa-cai',
  'gappj-raaaa-aaaap-aakoa-cai',
  'c7y4k-oqaaa-aaaap-aakxa-cai',
  '4roda-taaaa-aaaap-aa3sq-cai',
  '6dm7p-oyaaa-aaaah-abxua-cai',
  'pkhyd-piaaa-aaaap-aal7q-cai',
  'q6ods-tiaaa-aaaap-aajxq-cai',
  'fab4i-diaaa-aaaah-acr2q-cai',
  'nwyv2-gaaaa-aaaaj-arc2a-cai',
  'v6rdg-paaaa-aaaap-aajka-cai',
  'amrli-aiaaa-aaaap-aav4a-cai',
  'kafas-uaaaa-aaaao-aaofq-cai',
  'e7jp7-aqaaa-aaaah-acr6a-cai',
  '2bcjs-tiaaa-aaaap-aa3ha-cai',
  '335nj-syaaa-aaaap-aaikq-cai',
  '5lnqo-qyaaa-aaaah-abqdq-cai',
  '33lzl-uyaaa-aaaap-aaxpa-cai',
  '27qc3-lyaaa-aaaap-aaimq-cai',
  'fioai-paaaa-aaaap-aanzq-cai',
  'ke2v7-iqaaa-aaaap-aalda-cai',
  '4pa74-jyaaa-aaaah-abqfq-cai',
  'seyiz-jqaaa-aaaah-abobq-cai',
  'gq7ji-saaaa-aaaap-aazeq-cai',
  'unzmm-zyaaa-aaaap-abagq-cai',
  'm7vrl-xaaaa-aaaap-aah3a-cai',
  'drbbg-zaaaa-aaaap-aannq-cai',
  'johir-5iaaa-aaaah-abyea-cai',
  'gw7hg-iqaaa-aaaap-aanqq-cai',
  'ut7hi-aiaaa-aaaap-aajnq-cai',
  'uyk5m-zqaaa-aaaap-aa2fq-cai',
  'qqmo2-iyaaa-aaaap-aajwq-cai',
  'd26yv-eqaaa-aaaah-abz4q-cai',
  'xarx3-ayaaa-aaaah-abjbq-cai',
  'vjadt-byaaa-aaaap-aa2aa-cai',
  'vsf7w-3aaaa-aaaap-aa2cq-cai',
  'xd2zm-2iaaa-aaaap-aawaa-cai',
  'ktlvk-giaaa-aaaap-aayja-cai',
  'xehin-vyaaa-aaaah-abo4a-cai',
  'jezzy-xqaaa-aaaap-aaybq-cai',
  'ah2fs-fqaaa-aaaak-aalya-cai',
  'xpegl-kaaaa-aaaah-abcrq-cai',
  'afeuw-qaaaa-aaaap-aakya-cai',
  'ff3uc-miaaa-aaaap-aakfq-cai',
  '53lcn-vyaaa-aaaah-ab4mq-cai',
  'nncvb-tyaaa-aaaah-abh2q-cai',
  'j3az4-4aaaa-aaaah-abyhq-cai',
  'tfitq-wqaaa-aaaap-aa2xq-cai',
  '2wf5f-3qaaa-aaaap-aaxiq-cai',
  'k6ucx-biaaa-aaaah-abyma-cai',
  'fjz4q-6iaaa-aaaap-aagiq-cai',
  'zicoj-2aaaa-aaaap-aaiea-cai',
  'o4mai-2yaaa-aaaap-aal2q-cai',
  'twfpe-jaaaa-aaaah-abjza-cai',
  'osona-biaaa-aaaap-aal3q-cai',
  'daqp5-niaaa-aaaap-aaktq-cai',
  'u44c2-mqaaa-aaaap-aa5ya-cai',
  'n46fk-6qaaa-aaaai-ackxa-cai',
  'pvimf-cyaaa-aaaah-abu4a-cai',
  '7aawj-2aaaa-aaaah-abxsq-cai',
  'lt2gz-oaaaa-aaaah-abylq-cai',
  'eze6x-xiaaa-aaaap-aan4a-cai',
  '6je2e-caaaa-aaaap-aaiua-cai',
  'ntmj5-jaaaa-aaaap-aamnq-cai',
  '2x763-hqaaa-aaaah-acupq-cai',
  'qca2u-aaaaa-aaaah-abomq-cai',
  'wakh7-myaaa-aaaah-abo2a-cai',
  'v5mzt-tqaaa-aaaah-abjoa-cai',
  'pvu3q-aqaaa-aaaap-aamaq-cai',
  'svjgc-5yaaa-aaaah-abj7q-cai',
  'cr2rc-vaaaa-aaaap-aakwa-cai',
  'lovxf-kaaaa-aaaap-aalea-cai',
  '4wuoq-vqaaa-aaaah-acmbq-cai',
  'mfhqa-iyaaa-aaaai-abona-cai',
  'slzze-ciaaa-aaaah-aa7ra-cai',
  'vqtoo-uqaaa-aaaap-aajla-cai',
  'bgi5q-eyaaa-aaaap-aak6q-cai',
  'xkpgs-kaaaa-aaaap-aajea-cai',
  '4uzum-riaaa-aaaap-aai3q-cai',
  'xizxk-fqaaa-aaaap-aa2nq-cai',
  'ahos3-5yaaa-aaaah-abbna-cai',
  '2duyk-4yaaa-aaaap-aaioq-cai',
  // 'xzrh4-zyaaa-aaaaj-qagaa-cai',
  'zthsm-ayaaa-aaaap-aaigq-cai',
  'q5fnf-jyaaa-aaaah-abwwa-cai',
  'ebkmf-xaaaa-aaaah-abs7a-cai',
]
const ntfList = ref<{ canisterId: string, nftLength: number }[]>([])
let client: AuthClient | undefined
const identity = ref<Identity | undefined>(undefined)
const pid = ref<string>('hfktm-a7wyh-fi7dm-4nady-ngzeh-nhjuz-jl7b3-yi5dg-wmfw6-obvoa-tae')
const agent = ref<Agent | undefined>();
const startTime = ref<number>(0)
const endTime = ref<number>(0)

const getNft = () => {
  startTime.value = 0
  endTime.value = 0
  ntfList.value = []
  if (!pid.value) return

  console.time("nftList");
  startTime.value = new Date().getTime()

  let from = get_account_id(pid.value);
  const promises = canister_arr.map(async (item) => {
    const NFTCanister = await getActor(item, identity.value);
    const ret = await NFTCanister.tokens_ext(from)
    if (!ret || 'err' in ret) {
      ntfList.value.push({ canisterId: item, nftLength: 0 });
      return
    }
    const tokens = ret.ok || [];
    ntfList.value.push({ canisterId: item, nftLength: tokens.length });
  });

  Promise.all(promises)
    .then(() => {
      console.timeEnd("nftList");
      endTime.value = new Date().getTime()
    })
    .catch((error) => {
      console.error(error);
    });
}

const init = async () => {
  client = await AuthClient.create({ idleOptions: { disableIdle: true } });
}

onMounted(() => {
  init()
  getNft()
})
</script>

<style scoped lang="less">
.btn {
  cursor: pointer;
}

.input {
  display: flex;
  align-items: center;

  input {
    width: 800px;
    height: 32px;

  }

  p {
    height: 32px;
    line-height: 32px;
    margin: 0;
    margin-left: 10px;
  }
}

.list {
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    border-bottom: 1px solid #e8e8e8;

    p {
      margin-right: 10px;
    }
  }
}
</style>