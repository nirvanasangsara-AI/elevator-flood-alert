// BTR Flood Worker v3 — Rain API + 좌표변환 + R2 승강기 캐시

const COORD_TABLE = {"서울특별시 종로구":[37.5730,126.9794],"서울특별시 중구":[37.5640,126.9975],"서울특별시 용산구":[37.5384,126.9654],"서울특별시 성동구":[37.5634,127.0369],"서울특별시 광진구":[37.5385,127.0822],"서울특별시 동대문구":[37.5744,127.0396],"서울특별시 중랑구":[37.6065,127.0927],"서울특별시 성북구":[37.5894,127.0167],"서울특별시 강북구":[37.6396,127.0257],"서울특별시 도봉구":[37.6688,127.0471],"서울특별시 노원구":[37.6542,127.0568],"서울특별시 은평구":[37.6177,126.9228],"서울특별시 서대문구":[37.5791,126.9368],"서울특별시 마포구":[37.5663,126.9014],"서울특별시 양천구":[37.5270,126.8561],"서울특별시 강서구":[37.5509,126.8496],"서울특별시 구로구":[37.4954,126.8874],"서울특별시 금천구":[37.4567,126.8955],"서울특별시 영등포구":[37.5264,126.8963],"서울특별시 동작구":[37.5124,126.9393],"서울특별시 관악구":[37.4784,126.9516],"서울특별시 서초구":[37.4837,127.0324],"서울특별시 강남구":[37.4980,127.0622],"서울특별시 송파구":[37.5145,127.1059],"서울특별시 강동구":[37.5301,127.1238],"부산광역시 중구":[35.1066,129.0327],"부산광역시 서구":[35.0976,129.0245],"부산광역시 동구":[35.1367,129.0464],"부산광역시 영도구":[35.0876,129.0680],"부산광역시 부산진구":[35.1588,129.0539],"부산광역시 동래구":[35.1978,129.0849],"부산광역시 남구":[35.1361,129.0862],"부산광역시 북구":[35.1972,128.9905],"부산광역시 해운대구":[35.1631,129.1637],"부산광역시 사하구":[35.0998,128.9745],"부산광역시 금정구":[35.2430,129.0923],"부산광역시 강서구":[35.2122,128.9804],"부산광역시 연제구":[35.1759,129.0810],"부산광역시 수영구":[35.1454,129.1133],"부산광역시 사상구":[35.1524,128.9926],"부산광역시 기장군":[35.2446,129.2224],"대구광역시 중구":[35.8694,128.5955],"대구광역시 동구":[35.8867,128.6351],"대구광역시 서구":[35.8720,128.5591],"대구광역시 남구":[35.8459,128.5972],"대구광역시 북구":[35.8858,128.5827],"대구광역시 수성구":[35.8575,128.6307],"대구광역시 달서구":[35.8296,128.5331],"대구광역시 달성군":[35.7747,128.4315],"인천광역시 중구":[37.4735,126.6216],"인천광역시 동구":[37.4774,126.6434],"인천광역시 미추홀구":[37.4638,126.6502],"인천광역시 연수구":[37.4102,126.6780],"인천광역시 남동구":[37.4486,126.7313],"인천광역시 부평구":[37.5071,126.7217],"인천광역시 계양구":[37.5374,126.7375],"인천광역시 서구":[37.5454,126.6758],"광주광역시 동구":[35.1457,126.9230],"광주광역시 서구":[35.1518,126.8893],"광주광역시 남구":[35.1332,126.9026],"광주광역시 북구":[35.1745,126.9117],"광주광역시 광산구":[35.1396,126.7935],"대전광역시 동구":[36.3122,127.4548],"대전광역시 중구":[36.3254,127.4218],"대전광역시 서구":[36.3548,127.3832],"대전광역시 유성구":[36.3622,127.3563],"대전광역시 대덕구":[36.3462,127.4149],"울산광역시 중구":[35.5688,129.3322],"울산광역시 남구":[35.5388,129.3317],"울산광역시 동구":[35.5048,129.4162],"울산광역시 북구":[35.5828,129.3611],"울산광역시 울주군":[35.5224,129.1624],"세종특별자치시":[36.4801,127.2890],"경기도 수원시":[37.2636,127.0286],"경기도 성남시":[37.4196,127.1267],"경기도 의정부시":[37.7381,127.0337],"경기도 안양시":[37.3943,126.9568],"경기도 부천시":[37.5035,126.7660],"경기도 광명시":[37.4784,126.8647],"경기도 평택시":[36.9922,127.1127],"경기도 안산시":[37.3219,126.8309],"경기도 고양시":[37.6584,126.8320],"경기도 과천시":[37.4292,126.9879],"경기도 구리시":[37.5942,127.1294],"경기도 남양주시":[37.6360,127.2160],"경기도 오산시":[37.1498,127.0775],"경기도 시흥시":[37.3800,126.8030],"경기도 군포시":[37.3614,126.9350],"경기도 의왕시":[37.3448,126.9678],"경기도 하남시":[37.5397,127.2148],"경기도 용인시":[37.2411,127.1775],"경기도 파주시":[37.7601,126.7802],"경기도 이천시":[37.2723,127.4352],"경기도 안성시":[37.0078,127.2798],"경기도 김포시":[37.6154,126.7158],"경기도 화성시":[37.1994,126.8316],"경기도 광주시":[37.4295,127.2555],"경기도 양주시":[37.7851,127.0458],"경기도 포천시":[37.8947,127.2001],"경기도 여주시":[37.2982,127.6372],"충청북도 청주시":[36.6424,127.4890],"충청북도 충주시":[36.9910,127.9259],"충청남도 천안시":[36.8151,127.1139],"충청남도 아산시":[36.7898,127.0021],"충청남도 서산시":[36.7849,126.4503],"충청남도 당진시":[36.8899,126.6456],"전북특별자치도 전주시":[35.8242,127.1480],"전북특별자치도 군산시":[35.9676,126.7368],"전북특별자치도 익산시":[35.9483,126.9577],"전라남도 목포시":[34.8118,126.3922],"전라남도 여수시":[34.7604,127.6622],"전라남도 순천시":[34.9506,127.4874],"경상북도 포항시":[36.0190,129.3434],"경상북도 경주시":[35.8562,129.2247],"경상북도 구미시":[36.1195,128.3446],"경상남도 창원시":[35.2280,128.6811],"경상남도 진주시":[35.1799,128.1076],"경상남도 김해시":[35.2285,128.8892],"경상남도 양산시":[35.3350,129.0368],"제주특별자치도 제주시":[33.4996,126.5312],"제주특별자치도 서귀포시":[33.2541,126.5600]};

// R2에 gzip으로 저장, Content-Encoding:gzip으로 브라우저에 전달 → 자동 해제
const R2_KEY = 'elevators_v1.json.gz';
const BTR_API = 'https://api.btrsoosung.com/api/btrdb/elevatorInstall/search';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

function addrToCoord(addr) {
  if (!addr) return null;
  const p = addr.split(' ');
  const k1 = p[0]+' '+p[1];
  const k2 = p[0]+' '+p[1]+' '+p[2];
  const base = COORD_TABLE[k2] || COORD_TABLE[k1] || null;
  if (!base) {
    const fb = Object.entries(COORD_TABLE).find(([k]) => k.startsWith(p[0]));
    if (!fb) return null;
    return [fb[1][0]+(Math.random()-.5)*.1, fb[1][1]+(Math.random()-.5)*.1];
  }
  return [base[0]+(Math.random()-.5)*.018, base[1]+(Math.random()-.5)*.018];
}

// Cron: Mac mini build_flood_cache.py가 매일 R2에 업로드하므로
// Worker scheduled는 가볍게 유지 (Worker에서 300페이지 수집 불가)
async function buildSmallCache(env) {
  // 1페이지 샘플만 — 수동 새로고침 용도
  const r = await fetch(`${BTR_API}?page=1&pageSize=1000`);
  const d = await r.json();
  const pts = (d.data || []).map(e => {
    const c = addrToCoord(e.buildingAddress1);
    if (!c) return null;
    return { lat: c[0], lng: c[1], under: parseInt(e.floorUnder||0), name: (e.buildingName||'').slice(0,20), addr: (e.buildingAddress1||'').slice(0,30), no: e.elevatorNo||'' };
  }).filter(Boolean);
  const payload = JSON.stringify({ ts: Date.now(), total: pts.length, points: pts });
  // gzip 압축 후 R2 저장
  const encoded = new TextEncoder().encode(payload);
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(encoded); writer.close();
  const buf = await new Response(cs.readable).arrayBuffer();
  await env.ELEV_CACHE.put(R2_KEY, buf, { httpMetadata: { contentType: 'application/json', contentEncoding: 'gzip' } });
}

export default {
  async scheduled(event, env, ctx) {
    // Mac mini 스크립트가 주 캐시 담당. Worker cron은 비상용만.
    ctx.waitUntil(buildSmallCache(env).catch(() => {}));
  },

  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // /elevators — R2 gzip 해제 후 평문 JSON 전송 (CF 엣지가 자동 재압축)
    if (url.pathname === '/elevators') {
      try {
        const obj = await env.ELEV_CACHE.get(R2_KEY);
        if (obj) {
          // gzip → DecompressionStream → 평문 스트림 → CF 엣지가 gzip 재압축
          const ds = new DecompressionStream('gzip');
          const decompressed = obj.body.pipeThrough(ds);
          return new Response(decompressed, {
            headers: {
              ...CORS,
              'Cache-Control': 'public, max-age=1800',
              'Vary': 'Accept-Encoding',
              'X-Cache': 'HIT',
            },
          });
        }
      } catch(e) {}
      // 캐시 미스: 1페이지 샘플 즉시 반환
      try {
        const r = await fetch(`${BTR_API}?page=1&pageSize=1000`);
        const d = await r.json();
        const pts = (d.data || []).map(e => {
          const c = addrToCoord(e.buildingAddress1);
          if (!c) return null;
          return { lat: c[0], lng: c[1], under: parseInt(e.floorUnder||0), name: (e.buildingName||'').slice(0,20), addr: (e.buildingAddress1||'').slice(0,30), no: e.elevatorNo||'' };
        }).filter(Boolean);
        return new Response(JSON.stringify({ ts: Date.now(), total: pts.length, points: pts }), {
          headers: { ...CORS, 'Cache-Control': 'no-store', 'X-Cache': 'MISS' },
        });
      } catch(e) {
        return new Response(JSON.stringify({ ts: Date.now(), total: 0, points: [] }), { headers: CORS });
      }
    }

    // /elevators/refresh — 수동 캐시 갱신 (Mac mini 스크립트 실행 유도)
    if (url.pathname === '/elevators/refresh') {
      ctx.waitUntil(buildSmallCache(env).catch(() => {}));
      return new Response(JSON.stringify({ ok: true, msg: '캐시 갱신 시작' }), { headers: CORS });
    }

    // /rain — 기상청 초단기실황 강수량
    if (url.pathname === '/rain') {
      const cities=[{name:'서울',nx:60,ny:127,lat:37.5665,lng:126.9780},{name:'부산',nx:98,ny:76,lat:35.1796,lng:129.0756},{name:'대구',nx:89,ny:90,lat:35.8714,lng:128.6014},{name:'인천',nx:55,ny:124,lat:37.4563,lng:126.7052},{name:'광주',nx:58,ny:74,lat:35.1595,lng:126.8526},{name:'대전',nx:67,ny:100,lat:36.3504,lng:127.3845},{name:'울산',nx:102,ny:84,lat:35.5384,lng:129.3114},{name:'수원',nx:60,ny:121,lat:37.2636,lng:127.0286},{name:'창원',nx:90,ny:77,lat:35.2280,lng:128.6811},{name:'전주',nx:63,ny:89,lat:35.8242,lng:127.1480},{name:'청주',nx:69,ny:107,lat:36.6424,lng:127.4890},{name:'포항',nx:102,ny:94,lat:36.0190,lng:129.3434}];
      const now=new Date(); const kst=new Date(now.getTime()+9*3600000);
      const bd=kst.toISOString().slice(0,10).replace(/-/g,'');
      const h=kst.getUTCHours(); const m=kst.getUTCMinutes();
      const fh=m<30?(h===0?23:h-1):h; const fm=m<30?'30':'00';
      const bt=String(fh).padStart(2,'0')+fm;
      const results=await Promise.all(cities.map(async c=>{
        try{
          const p=new URLSearchParams({serviceKey:env.DATA_GO_KEY,pageNo:1,numOfRows:10,dataType:'JSON',base_date:bd,base_time:bt,nx:c.nx,ny:c.ny});
          const r=await fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${p}`);
          const d=await r.json();
          const items=d?.response?.body?.items?.item||[];
          const rn1=items.find(x=>x.category==='RN1');
          const pty=items.find(x=>x.category==='PTY');
          let val=parseFloat(rn1?.obsrValue||0);
          if(isNaN(val)||rn1?.obsrValue==='강수없음')val=0;
          return{...c,rain:val,pty:parseInt(pty?.obsrValue||0)};
        }catch{return{...c,rain:0,pty:0};}
      }));
      return new Response(JSON.stringify(results),{headers:{...CORS,'Cache-Control':'public, max-age=300'}});
    }

    // /coord — 배치 좌표 변환 (하위호환)
    if (url.pathname === '/coord' && req.method === 'POST') {
      const {addresses} = await req.json();
      const result = (addresses||[]).map(addr => addrToCoord(addr));
      return new Response(JSON.stringify(result), { headers: CORS });
    }

    return new Response('BTR Flood Alert Worker v3', { headers: {'Content-Type':'text/plain'} });
  },
};
