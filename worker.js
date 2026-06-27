// BTR Flood Worker v3 — Rain API + 좌표변환 + R2 승강기 캐시

const COORD_TABLE = {"서울특별시 종로구":[37.5730,126.9794],"서울특별시 중구":[37.5640,126.9975],"서울특별시 용산구":[37.5384,126.9654],"서울특별시 성동구":[37.5634,127.0369],"서울특별시 광진구":[37.5385,127.0822],"서울특별시 동대문구":[37.5744,127.0396],"서울특별시 중랑구":[37.6065,127.0927],"서울특별시 성북구":[37.5894,127.0167],"서울특별시 강북구":[37.6396,127.0257],"서울특별시 도봉구":[37.6688,127.0471],"서울특별시 노원구":[37.6542,127.0568],"서울특별시 은평구":[37.6177,126.9228],"서울특별시 서대문구":[37.5791,126.9368],"서울특별시 마포구":[37.5663,126.9014],"서울특별시 양천구":[37.5270,126.8561],"서울특별시 강서구":[37.5509,126.8496],"서울특별시 구로구":[37.4954,126.8874],"서울특별시 금천구":[37.4567,126.8955],"서울특별시 영등포구":[37.5264,126.8963],"서울특별시 동작구":[37.5124,126.9393],"서울특별시 관악구":[37.4784,126.9516],"서울특별시 서초구":[37.4837,127.0324],"서울특별시 강남구":[37.4980,127.0622],"서울특별시 송파구":[37.5145,127.1059],"서울특별시 강동구":[37.5301,127.1238],"부산광역시 중구":[35.1066,129.0327],"부산광역시 서구":[35.0976,129.0245],"부산광역시 동구":[35.1367,129.0464],"부산광역시 영도구":[35.0876,129.0680],"부산광역시 부산진구":[35.1588,129.0539],"부산광역시 동래구":[35.1978,129.0849],"부산광역시 남구":[35.1361,129.0862],"부산광역시 북구":[35.1972,128.9905],"부산광역시 해운대구":[35.1631,129.1637],"부산광역시 사하구":[35.0998,128.9745],"부산광역시 금정구":[35.2430,129.0923],"부산광역시 강서구":[35.2122,128.9804],"부산광역시 연제구":[35.1759,129.0810],"부산광역시 수영구":[35.1454,129.1133],"부산광역시 사상구":[35.1524,128.9926],"부산광역시 기장군":[35.2446,129.2224],"대구광역시 중구":[35.8694,128.5955],"대구광역시 동구":[35.8867,128.6351],"대구광역시 서구":[35.8720,128.5591],"대구광역시 남구":[35.8459,128.5972],"대구광역시 북구":[35.8858,128.5827],"대구광역시 수성구":[35.8575,128.6307],"대구광역시 달서구":[35.8296,128.5331],"대구광역시 달성군":[35.7747,128.4315],"인천광역시 중구":[37.4735,126.6216],"인천광역시 동구":[37.4774,126.6434],"인천광역시 미추홀구":[37.4638,126.6502],"인천광역시 연수구":[37.4102,126.6780],"인천광역시 남동구":[37.4486,126.7313],"인천광역시 부평구":[37.5071,126.7217],"인천광역시 계양구":[37.5374,126.7375],"인천광역시 서구":[37.5454,126.6758],"광주광역시 동구":[35.1457,126.9230],"광주광역시 서구":[35.1518,126.8893],"광주광역시 남구":[35.1332,126.9026],"광주광역시 북구":[35.1745,126.9117],"광주광역시 광산구":[35.1396,126.7935],"대전광역시 동구":[36.3122,127.4548],"대전광역시 중구":[36.3254,127.4218],"대전광역시 서구":[36.3548,127.3832],"대전광역시 유성구":[36.3622,127.3563],"대전광역시 대덕구":[36.3462,127.4149],"울산광역시 중구":[35.5688,129.3322],"울산광역시 남구":[35.5388,129.3317],"울산광역시 동구":[35.5048,129.4162],"울산광역시 북구":[35.5828,129.3611],"울산광역시 울주군":[35.5224,129.1624],"세종특별자치시":[36.4801,127.2890],"경기도 수원시":[37.2636,127.0286],"경기도 성남시":[37.4196,127.1267],"경기도 의정부시":[37.7381,127.0337],"경기도 안양시":[37.3943,126.9568],"경기도 부천시":[37.5035,126.7660],"경기도 광명시":[37.4784,126.8647],"경기도 평택시":[36.9922,127.1127],"경기도 안산시":[37.3219,126.8309],"경기도 고양시":[37.6584,126.8320],"경기도 과천시":[37.4292,126.9879],"경기도 구리시":[37.5942,127.1294],"경기도 남양주시":[37.6360,127.2160],"경기도 오산시":[37.1498,127.0775],"경기도 시흥시":[37.3800,126.8030],"경기도 군포시":[37.3614,126.9350],"경기도 의왕시":[37.3448,126.9678],"경기도 하남시":[37.5397,127.2148],"경기도 용인시":[37.2411,127.1775],"경기도 파주시":[37.7601,126.7802],"경기도 이천시":[37.2723,127.4352],"경기도 안성시":[37.0078,127.2798],"경기도 김포시":[37.6154,126.7158],"경기도 화성시":[37.1994,126.8316],"경기도 광주시":[37.4295,127.2555],"경기도 양주시":[37.7851,127.0458],"경기도 포천시":[37.8947,127.2001],"경기도 여주시":[37.2982,127.6372],"충청북도 청주시":[36.6424,127.4890],"충청북도 충주시":[36.9910,127.9259],"충청남도 천안시":[36.8151,127.1139],"충청남도 아산시":[36.7898,127.0021],"충청남도 서산시":[36.7849,126.4503],"충청남도 당진시":[36.8899,126.6456],"전북특별자치도 전주시":[35.8242,127.1480],"전북특별자치도 군산시":[35.9676,126.7368],"전북특별자치도 익산시":[35.9483,126.9577],"전라남도 목포시":[34.8118,126.3922],"전라남도 여수시":[34.7604,127.6622],"전라남도 순천시":[34.9506,127.4874],"경상북도 포항시":[36.0190,129.3434],"경상북도 경주시":[35.8562,129.2247],"경상북도 구미시":[36.1195,128.3446],"경상남도 창원시":[35.2280,128.6811],"경상남도 진주시":[35.1799,128.1076],"경상남도 김해시":[35.2285,128.8892],"경상남도 양산시":[35.3350,129.0368],"제주특별자치도 제주시":[33.4996,126.5312],"제주특별자치도 서귀포시":[33.2541,126.5600]};

// R2에 gzip으로 저장, Content-Encoding:gzip으로 브라우저에 전달 → 자동 해제
const R2_KEY = 'elevators_v1.json.gz';
const R2_SUMMARY_KEY = 'elevators_summary.json'; // Mac mini 사전계산 평문 JSON (26KB)
const SUMMARY_CACHE = {"ts":1782458176704,"total":880794,"regions":[{"lat":37.573,"lng":126.9794,"key":"서울특별시 종로구","total":4846,"under":3594},{"lat":37.6177,"lng":126.9228,"key":"서울특별시 은평구","total":7098,"under":3922},{"lat":37.5384,"lng":126.9654,"key":"서울특별시 용산구","total":4753,"under":3246},{"lat":37.5663,"lng":126.9014,"key":"서울특별시 마포구","total":7771,"under":4974},{"lat":37.5634,"lng":127.0369,"key":"서울특별시 성동구","total":4980,"under":3370},{"lat":37.5385,"lng":127.0822,"key":"서울특별시 광진구","total":5549,"under":2430},{"lat":37.564,"lng":126.9975,"key":"서울특별시 중구","total":7077,"under":5365},{"lat":37.5744,"lng":127.0396,"key":"서울특별시 동대문구","total":5948,"under":3664},{"lat":37.5791,"lng":126.9368,"key":"서울특별시 서대문구","total":4798,"under":3110},{"lat":37.5264,"lng":126.8963,"key":"서울특별시 영등포구","total":8700,"under":6060},{"lat":37.5509,"lng":126.8496,"key":"서울특별시 강서구","total":11158,"under":6637},{"lat":37.4784,"lng":126.9516,"key":"서울특별시 관악구","total":6989,"under":3344},{"lat":37.4954,"lng":126.8874,"key":"서울특별시 구로구","total":6341,"under":4110},{"lat":37.527,"lng":126.8561,"key":"서울특별시 양천구","total":5616,"under":2977},{"lat":37.4567,"lng":126.8955,"key":"서울특별시 금천구","total":4896,"under":2844},{"lat":37.5124,"lng":126.9393,"key":"서울특별시 동작구","total":5492,"under":3388},{"lat":37.4837,"lng":127.0324,"key":"서울특별시 서초구","total":12536,"under":9907},{"lat":37.498,"lng":127.0622,"key":"서울특별시 강남구","total":19302,"under":16182},{"lat":37.5145,"lng":127.1059,"key":"서울특별시 송파구","total":11895,"under":8271},{"lat":37.5301,"lng":127.1238,"key":"서울특별시 강동구","total":8304,"under":5511},{"lat":37.6065,"lng":127.0927,"key":"서울특별시 중랑구","total":5578,"under":2200},{"lat":37.6396,"lng":127.0257,"key":"서울특별시 강북구","total":3688,"under":1702},{"lat":37.6542,"lng":127.0568,"key":"서울특별시 노원구","total":5876,"under":2506},{"lat":37.5894,"lng":127.0167,"key":"서울특별시 성북구","total":6183,"under":3624},{"lat":37.6688,"lng":127.0471,"key":"서울특별시 도봉구","total":3982,"under":1452},{"lat":37.636,"lng":127.216,"key":"경기도 남양주시","total":11493,"under":6579},{"lat":37.7381,"lng":127.0337,"key":"경기도 의정부시","total":7322,"under":3756},{"lat":37.5942,"lng":127.1294,"key":"경기도 구리시","total":3063,"under":1650},{"lat":37.6154,"lng":126.7158,"key":"경기도 김포시","total":9057,"under":5279},{"lat":37.4784,"lng":126.8647,"key":"경기도 광명시","total":4305,"under":2702},{"lat":37.5397,"lng":127.2148,"key":"경기도 하남시","total":6053,"under":4245},{"lat":37.6584,"lng":126.832,"key":"경기도 고양시","total":17743,"under":9946},{"lat":37.7601,"lng":126.7802,"key":"경기도 파주시","total":10107,"under":5790},{"lat":37.3943,"lng":126.9568,"key":"경기도 안양시","total":9159,"under":5144},{"lat":36.9922,"lng":127.1127,"key":"경기도 평택시","total":16313,"under":6328},{"lat":37.3219,"lng":126.8309,"key":"경기도 안산시","total":10155,"under":4106},{"lat":37.1994,"lng":126.8316,"key":"경기도 화성시","total":19571,"under":11268},{"lat":37.2411,"lng":127.1775,"key":"경기도 용인시","total":19235,"under":10905},{"lat":37.4102,"lng":126.678,"key":"인천광역시 연수구","total":7414,"under":4869},{"lat":37.5374,"lng":126.7375,"key":"인천광역시 계양구","total":3684,"under":1492},{"lat":37.0078,"lng":127.2798,"key":"경기도 안성시","total":4051,"under":1413},{"lat":35.5224,"lng":129.1624,"key":"울산광역시 울주군","total":3939,"under":1487},{"lat":35.8858,"lng":128.5827,"key":"대구광역시 북구","total":6521,"under":3034},{"lat":35.9676,"lng":126.7368,"key":"전북특별자치도 군산시","total":4173,"under":1550},{"lat":35.228,"lng":128.6811,"key":"경상남도 창원시","total":14863,"under":7942},{"lat":37.7851,"lng":127.0458,"key":"경기도 양주시","total":5066,"under":2688},{"lat":37.8947,"lng":127.2001,"key":"경기도 포천시","total":2274,"under":650},{"lat":37.2636,"lng":127.0286,"key":"경기도 수원시","total":22794,"under":11534},{"lat":37.1498,"lng":127.0775,"key":"경기도 오산시","total":4986,"under":2426},{"lat":37.38,"lng":126.803,"key":"경기도 시흥시","total":9740,"under":4758},{"lat":37.2982,"lng":127.6372,"key":"경기도 여주시","total":1901,"under":657},{"lat":37.4196,"lng":127.1267,"key":"경기도 성남시","total":16619,"under":10617},{"lat":37.4295,"lng":127.2555,"key":"경기도 광주시","total":7315,"under":3074},{"lat":37.2723,"lng":127.4352,"key":"경기도 이천시","total":4863,"under":1962},{"lat":37.4774,"lng":126.6434,"key":"인천광역시 동구","total":802,"under":429},{"lat":37.4486,"lng":126.7313,"key":"인천광역시 남동구","total":7816,"under":4060},{"lat":37.5071,"lng":126.7217,"key":"인천광역시 부평구","total":7282,"under":3366},{"lat":37.4638,"lng":126.6502,"key":"인천광역시 미추홀구","total":6272,"under":3204},{"lat":37.4735,"lng":126.6216,"key":"인천광역시 중구","total":5585,"under":3253},{"lat":37.5454,"lng":126.6758,"key":"인천광역시 서구","total":11434,"under":6592},{"lat":37.3614,"lng":126.935,"key":"경기도 군포시","total":4362,"under":1858},{"lat":37.3448,"lng":126.9678,"key":"경기도 의왕시","total":3370,"under":1880},{"lat":37.4292,"lng":126.9879,"key":"경기도 과천시","total":2087,"under":1371},{"lat":37.5035,"lng":126.766,"key":"경기도 부천시","total":12905,"under":6046},{"lat":36.3622,"lng":127.3563,"key":"대전광역시 유성구","total":9030,"under":4465},{"lat":36.8151,"lng":127.1139,"key":"충청남도 천안시","total":14999,"under":6204},{"lat":35.1396,"lng":126.7935,"key":"광주광역시 광산구","total":7102,"under":2949},{"lat":36.3548,"lng":127.3832,"key":"대전광역시 서구","total":9147,"under":3795},{"lat":36.3122,"lng":127.4548,"key":"대전광역시 동구","total":3625,"under":1712},{"lat":36.3254,"lng":127.4218,"key":"대전광역시 중구","total":4130,"under":1677},{"lat":36.3462,"lng":127.4149,"key":"대전광역시 대덕구","total":2516,"under":873},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 전의면","total":117,"under":23},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 조치원읍","total":818,"under":344},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 연서면","total":74,"under":12},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다솜로","total":101,"under":82},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도움3로","total":109,"under":102},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 연동면","total":85,"under":11},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소정면","total":80,"under":26},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 금남면","total":102,"under":29},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 전동면","total":40,"under":6},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다솜1로","total":150,"under":131},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 장군면","total":101,"under":19},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬3로","total":120,"under":103},{"lat":36.6424,"lng":127.489,"key":"충청북도 청주시","total":16650,"under":7473},{"lat":36.991,"lng":127.9259,"key":"충청북도 충주시","total":3811,"under":1358},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 부강면","total":167,"under":11},{"lat":36.7898,"lng":127.0021,"key":"충청남도 아산시","total":8087,"under":3630},{"lat":36.8899,"lng":126.6456,"key":"충청남도 당진시","total":3013,"under":1198},{"lat":36.7849,"lng":126.4503,"key":"충청남도 서산시","total":3151,"under":1136},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 누리로","total":110,"under":100},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 라온로","total":11,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 연기면","total":53,"under":12},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬남로","total":81,"under":78},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대평1길","total":52,"under":48},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나리1로","total":47,"under":45},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다솜3로","total":31,"under":18},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정서로","total":21,"under":19},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 한누리대로","total":332,"under":299},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 달빛2로","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 금송로","total":17,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원로","total":7,"under":2},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 달빛로","total":159,"under":155},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬로","total":93,"under":88},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 하나로","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 가름로","total":84,"under":74},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나리로","total":49,"under":40},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬중앙로","total":181,"under":177},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 노을3로","total":70,"under":64},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보람로","total":82,"under":77},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 노을1로","total":4,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬4로","total":73,"under":72},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 달빛1로","total":124,"under":108},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 용포로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 어울로","total":3,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도움1로","total":183,"under":167},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 갈매로","total":157,"under":136},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도움8로","total":17,"under":14},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다솜2로","total":58,"under":53},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도움6로","total":39,"under":29},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 호려울로","total":19,"under":19},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성북1로","total":58,"under":47},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 세종로","total":34,"under":24},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 남세종로","total":356,"under":324},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬중앙1로","total":20,"under":16},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 마음안로","total":115,"under":109},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬1로","total":11,"under":10},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬2로","total":45,"under":43},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 노을6로","total":24,"under":18},{"lat":35.8242,"lng":127.148,"key":"전북특별자치도 전주시","total":11720,"under":5290},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 어울누리로","total":17,"under":14},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 시청대로","total":320,"under":295},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 누리1로","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성북로","total":52,"under":50},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성남로","total":6,"under":6},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬북로","total":70,"under":70},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 마음로","total":204,"under":194},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 만남로","total":80,"under":67},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬8로","total":6,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬6로","total":7,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 절재로","total":47,"under":42},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬7로","total":37,"under":37},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 아름서길","total":8,"under":7},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운서길","total":9,"under":8},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 마음안1로","total":61,"under":54},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 금남구즉로","total":9,"under":8},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대평동","total":4,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원1로","total":26,"under":26},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성로","total":71,"under":71},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보람동","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 아름서1길","total":16,"under":16},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 종합운동장4로","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 정부2청사로","total":2,"under":2},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국세청로","total":119,"under":66},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담4로","total":10,"under":7},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담로","total":12,"under":10},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보람동로","total":48,"under":46},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담1로","total":8,"under":5},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대평로","total":123,"under":114},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보듬5로","total":3,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보람1길","total":12,"under":11},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 한솔동로","total":2,"under":2},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담3로","total":24,"under":23},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬서로","total":3,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 만남로3길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정남로","total":99,"under":87},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 가온로","total":23,"under":19},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정중앙로","total":135,"under":134},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정북로","total":150,"under":145},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 새롬동","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대평3길","total":69,"under":54},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정4길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 보람서로","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 종합운동장1로","total":6,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 반곡2길","total":20,"under":18},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원2로","total":3,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 반곡1길","total":32,"under":32},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 반곡로","total":87,"under":81},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 밝은뜰로","total":52,"under":52},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 바른3길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원3로","total":5,"under":5},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정5길","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운서1길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙7로","total":21,"under":20},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대평4길","total":7,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 반곡3길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 법원2로","total":7,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담8로","total":18,"under":16},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 대교길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙3로","total":3,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 법원로","total":6,"under":6},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀3로","total":188,"under":173},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운뜰7길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정남3로","total":4,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 중앙공원서로","total":25,"under":22},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 반곡동","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도담서4길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀2로","total":17,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현서로","total":71,"under":64},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운별빛길","total":3,"under":2},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현서2로","total":25,"under":23},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원4로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀1로","total":8,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙로","total":8,"under":8},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 임난수로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현북로","total":44,"under":33},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국책연구원5로","total":7,"under":4},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙4로","total":12,"under":8},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 당산로","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀동","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 국립박물관로","total":5,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현동로","total":15,"under":12},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성동","total":2,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 종합운동장로","total":4,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운한옥1길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운주택1길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 모롱지로","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 부강신대길","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 밀마루2길","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다정로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 다솜동","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙2로","total":6,"under":5},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울7로","total":88,"under":79},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울2로","total":67,"under":64},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울3로","total":67,"under":58},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현부강로","total":3,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 행복대로","total":19,"under":19},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀숲2길","total":2,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙5로","total":4,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 수목원로","total":3,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현중앙1로","total":13,"under":13},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 법원1로","total":3,"under":3},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울1로","total":11,"under":10},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀5로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 나성동로","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울8로","total":5,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 산울동","total":11,"under":10},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 고운동1901","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 집현동","total":14,"under":11},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 합강동","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 해밀4로","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 소담동","total":1,"under":0},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 도담동","total":1,"under":1},{"lat":36.4801,"lng":127.289,"key":"세종특별자치시 시청남길","total":2,"under":2},{"lat":35.5388,"lng":129.3317,"key":"울산광역시 남구","total":6342,"under":2472},{"lat":35.8296,"lng":128.5331,"key":"대구광역시 달서구","total":7983,"under":3301},{"lat":35.8575,"lng":128.6307,"key":"대구광역시 수성구","total":7110,"under":3113},{"lat":35.8459,"lng":128.5972,"key":"대구광역시 남구","total":1973,"under":927},{"lat":35.8694,"lng":128.5955,"key":"대구광역시 중구","total":3001,"under":1869},{"lat":35.7747,"lng":128.4315,"key":"대구광역시 달성군","total":4095,"under":2287},{"lat":35.872,"lng":128.5591,"key":"대구광역시 서구","total":1867,"under":830},{"lat":35.8867,"lng":128.6351,"key":"대구광역시 동구","total":5919,"under":3217},{"lat":36.019,"lng":129.3434,"key":"경상북도 포항시","total":7593,"under":2691},{"lat":35.8562,"lng":129.2247,"key":"경상북도 경주시","total":3867,"under":1275},{"lat":36.1195,"lng":128.3446,"key":"경상북도 구미시","total":6523,"under":2685},{"lat":35.1745,"lng":126.9117,"key":"광주광역시 북구","total":7109,"under":2821},{"lat":34.8118,"lng":126.3922,"key":"전라남도 목포시","total":3845,"under":1298},{"lat":35.1518,"lng":126.8893,"key":"광주광역시 서구","total":5796,"under":2396},{"lat":35.1332,"lng":126.9026,"key":"광주광역시 남구","total":3524,"under":1640},{"lat":35.1457,"lng":126.923,"key":"광주광역시 동구","total":2716,"under":1509},{"lat":34.9506,"lng":127.4874,"key":"전라남도 순천시","total":4448,"under":1917},{"lat":34.7604,"lng":127.6622,"key":"전라남도 여수시","total":4776,"under":1881},{"lat":35.9483,"lng":126.9577,"key":"전북특별자치도 익산시","total":3995,"under":1394},{"lat":35.0998,"lng":128.9745,"key":"부산광역시 사하구","total":4488,"under":1893},{"lat":35.1524,"lng":128.9926,"key":"부산광역시 사상구","total":3194,"under":1216},{"lat":35.1588,"lng":129.0539,"key":"부산광역시 부산진구","total":6479,"under":3461},{"lat":35.1631,"lng":129.1637,"key":"부산광역시 해운대구","total":6785,"under":3786},{"lat":35.1972,"lng":128.9905,"key":"부산광역시 북구","total":3522,"under":1745},{"lat":35.243,"lng":129.0923,"key":"부산광역시 금정구","total":3345,"under":1519},{"lat":35.1759,"lng":129.081,"key":"부산광역시 연제구","total":3583,"under":1793},{"lat":35.1361,"lng":129.0862,"key":"부산광역시 남구","total":3823,"under":1831},{"lat":35.1367,"lng":129.0464,"key":"부산광역시 동구","total":1705,"under":954},{"lat":35.1066,"lng":129.0327,"key":"부산광역시 중구","total":1394,"under":705},{"lat":35.1978,"lng":129.0849,"key":"부산광역시 동래구","total":4167,"under":2061},{"lat":35.1454,"lng":129.1133,"key":"부산광역시 수영구","total":3151,"under":1308},{"lat":35.2122,"lng":128.9804,"key":"부산광역시 강서구","total":3617,"under":2068},{"lat":35.2446,"lng":129.2224,"key":"부산광역시 기장군","total":3986,"under":2265},{"lat":35.0976,"lng":129.0245,"key":"부산광역시 서구","total":1887,"under":890},{"lat":35.0876,"lng":129.068,"key":"부산광역시 영도구","total":1315,"under":488},{"lat":35.5688,"lng":129.3322,"key":"울산광역시 중구","total":3128,"under":1394},{"lat":35.5048,"lng":129.4162,"key":"울산광역시 동구","total":2109,"under":799},{"lat":35.335,"lng":129.0368,"key":"경상남도 양산시","total":6108,"under":3068},{"lat":35.5828,"lng":129.3611,"key":"울산광역시 북구","total":3661,"under":1411},{"lat":35.2285,"lng":128.8892,"key":"경상남도 김해시","total":8354,"under":3880},{"lat":35.1799,"lng":128.1076,"key":"경상남도 진주시","total":5258,"under":2239},{"lat":33.4996,"lng":126.5312,"key":"제주특별자치도 제주시","total":11844,"under":4734},{"lat":33.2541,"lng":126.56,"key":"제주특별자치도 서귀포시","total":5020,"under":1880}]}; // 880K건 집계 (Mac mini 빌드)
const BTR_API = 'https://api.btrsoosung.com/api/btrdb/elevatorInstall/search';

// AWS 매분자료 — ASOS 전국 95개 관측소
const AWS_STATIONS = [
  // 수도권
  {stn:108,name:'서울',lat:37.571,lng:126.966},{stn:112,name:'인천',lat:37.478,lng:126.625},
  {stn:119,name:'수원',lat:37.264,lng:126.999},{stn:201,name:'강화',lat:37.709,lng:126.453},
  {stn:202,name:'양평',lat:37.488,lng:127.494},{stn:203,name:'이천',lat:37.263,lng:127.482},
  {stn:211,name:'인제',lat:38.061,lng:128.167},{stn:212,name:'홍천',lat:37.678,lng:127.889},
  {stn:216,name:'태백',lat:37.170,lng:128.985},{stn:217,name:'정선',lat:37.374,lng:128.660},
  // 강원
  {stn:90,name:'속초',lat:38.251,lng:128.565},{stn:95,name:'철원',lat:38.148,lng:127.300},
  {stn:100,name:'대관령',lat:37.677,lng:128.718},{stn:101,name:'춘천',lat:37.903,lng:127.736},
  {stn:105,name:'강릉',lat:37.751,lng:128.891},{stn:106,name:'동해',lat:37.511,lng:129.117},
  {stn:114,name:'원주',lat:37.338,lng:127.948},{stn:115,name:'울릉도',lat:37.481,lng:130.898},
  {stn:130,name:'울진',lat:36.982,lng:129.415},{stn:221,name:'제천',lat:37.160,lng:128.195},
  // 충청
  {stn:127,name:'충주',lat:36.970,lng:127.926},{stn:129,name:'서산',lat:36.777,lng:126.493},
  {stn:131,name:'청주',lat:36.639,lng:127.441},{stn:133,name:'대전',lat:36.372,lng:127.374},
  {stn:135,name:'추풍령',lat:36.220,lng:127.993},{stn:226,name:'보은',lat:36.489,lng:127.730},
  {stn:232,name:'금산',lat:36.106,lng:127.484},{stn:235,name:'보령',lat:36.332,lng:126.560},
  {stn:236,name:'부여',lat:36.275,lng:126.921},{stn:238,name:'천안',lat:36.775,lng:127.118},
  {stn:239,name:'서산',lat:36.741,lng:126.463},{stn:244,name:'임실',lat:35.612,lng:127.289},
  // 전라
  {stn:140,name:'군산',lat:35.987,lng:126.760},{stn:146,name:'전주',lat:35.824,lng:127.148},
  {stn:156,name:'광주',lat:35.172,lng:126.891},{stn:165,name:'목포',lat:34.818,lng:126.381},
  {stn:168,name:'여수',lat:34.734,lng:127.741},{stn:169,name:'흑산도',lat:34.683,lng:125.452},
  {stn:170,name:'완도',lat:34.400,lng:126.702},{stn:172,name:'고흥',lat:34.619,lng:127.278},
  {stn:174,name:'순천',lat:34.900,lng:127.490},{stn:243,name:'부안',lat:35.730,lng:126.722},
  {stn:247,name:'남원',lat:35.414,lng:127.390},{stn:248,name:'장수',lat:35.648,lng:127.521},
  {stn:256,name:'고창',lat:35.434,lng:126.703},{stn:260,name:'광양',lat:34.940,lng:127.696},
  {stn:261,name:'장흥',lat:34.683,lng:126.909},{stn:262,name:'해남',lat:34.549,lng:126.568},
  {stn:266,name:'진도',lat:34.482,lng:126.263},{stn:268,name:'완도',lat:34.306,lng:126.755},
  // 경상
  {stn:136,name:'안동',lat:36.574,lng:128.707},{stn:137,name:'상주',lat:36.411,lng:128.329},
  {stn:138,name:'포항',lat:36.032,lng:129.380},{stn:143,name:'대구',lat:35.884,lng:128.617},
  {stn:152,name:'울산',lat:35.560,lng:129.320},{stn:155,name:'창원',lat:35.167,lng:128.567},
  {stn:159,name:'부산',lat:35.104,lng:129.032},{stn:162,name:'통영',lat:34.846,lng:128.433},
  {stn:175,name:'진주',lat:35.163,lng:128.040},{stn:176,name:'거창',lat:35.674,lng:127.910},
  {stn:177,name:'합천',lat:35.565,lng:128.166},{stn:271,name:'봉화',lat:36.937,lng:128.917},
  {stn:272,name:'영주',lat:36.872,lng:128.517},{stn:273,name:'문경',lat:36.627,lng:128.148},
  {stn:276,name:'청송',lat:36.434,lng:129.057},{stn:278,name:'영천',lat:35.973,lng:128.951},
  {stn:279,name:'경주',lat:35.840,lng:129.212},{stn:281,name:'거제',lat:34.889,lng:128.608},
  {stn:283,name:'의령',lat:35.323,lng:128.261},{stn:284,name:'남해',lat:34.838,lng:127.920},
  {stn:285,name:'밀양',lat:35.492,lng:128.749},{stn:288,name:'산청',lat:35.414,lng:127.874},
  {stn:289,name:'함양',lat:35.519,lng:127.725},{stn:294,name:'고성',lat:34.974,lng:128.322},
  {stn:295,name:'사천',lat:35.099,lng:128.065},{stn:296,name:'김해',lat:35.228,lng:128.892},
  // 제주
  {stn:184,name:'제주',lat:33.514,lng:126.530},{stn:185,name:'고산',lat:33.294,lng:126.163},
  {stn:188,name:'성산',lat:33.386,lng:126.880},{stn:189,name:'서귀포',lat:33.246,lng:126.565},
  // 도서·해안
  {stn:102,name:'백령도',lat:37.967,lng:124.634},{stn:104,name:'북강릉',lat:37.803,lng:128.866},
  {stn:108,name:'서울',lat:37.571,lng:126.966}, // 중복 제거용 더미
  {stn:189,name:'서귀포',lat:33.246,lng:126.565},
].filter((v,i,a)=>a.findIndex(t=>t.stn===v.stn)===i); // 중복 제거

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

// Cron: Mac mini build_flood_cache.py가 매일 R2에 업로드 (전체 909K건)
// Worker scheduled는 아무것도 하지 않음 — 소규모 덮어쓰기 방지
async function buildSmallCache(env) {
  // 비활성화 — Mac mini 스크립트가 전량 캐시 담당
  return;
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
          // gzip 해제 후 평문 JSON 반환
          const ds = new DecompressionStream('gzip');
          const decompressed = obj.body.pipeThrough(ds);
          return new Response(decompressed, {
            headers: {
              ...CORS,
              'Cache-Control': 'public, max-age=1800',
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

    // /weather — AWS 전국 일괄 조회 (stn=0) + 태풍
    if (url.pathname === '/weather') {
      const kst = new Date(Date.now() + 9*3600000);
      const pad = n => String(n).padStart(2,'0');
      const t = new Date(kst.getTime() - 10*60000);
      const tm = `${t.getUTCFullYear()}${pad(t.getUTCMonth()+1)}${pad(t.getUTCDate())}${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}`;

      // stn=0 → 전국 전체 한 번에
      let awsResults = [];
      try {
        const r = await fetch(
          `https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-aws2_min?tm2=${tm}&stn=0&help=0&authKey=${env.KMA_AUTH_KEY}`,
          { signal: AbortSignal.timeout(10000) }
        );
        const txt = await r.text();
        // STN 코드 → 관측소 정보 맵
        const stnMap = {};
        AWS_STATIONS.forEach(s => { stnMap[s.stn] = s; });
        const v = x => { const n = parseFloat(x); return (isNaN(n)||n<-50) ? null : n; };
        awsResults = txt.split('\n')
          .filter(l => l.trim() && !l.startsWith('#') && !l.includes('7777'))
          .map(l => {
            const f = l.trim().split(/\s+/);
            if (f.length < 15) return null;
            const stn = parseInt(f[1]);
            const info = stnMap[stn];
            if (!info) return null; // 목록에 없는 관측소 제외
            return { ...info, ta: v(f[8]), hm: v(f[14]), ws: v(f[3]), wd: v(f[2]), rn: v(f[10]) };
          })
          .filter(Boolean);
      } catch(e) {}

      // 태풍
      let typhoons = [];
      try {
        const yr = kst.getUTCFullYear();
        const tr = await fetch(
          `https://apihub.kma.go.kr/api/typ01/url/typ_lst.php?YY=${yr}&disp=0&help=0&authKey=${env.KMA_AUTH_KEY}`,
          { signal: AbortSignal.timeout(6000) }
        );
        const ttxt = await tr.text();
        typhoons = ttxt.split('\n')
          .filter(l => l.trim() && !l.startsWith('#') && !l.includes('7777'))
          .map(l => {
            const f = l.trim().split(/\s+/);
            return { yr:f[0], seq:f[1], active:f[2]==='1', eff:f[3], name_en:f[7]||f[6] };
          })
          .filter(t => t.active);
      } catch {}

      return new Response(JSON.stringify({ ts: Date.now(), obs_tm: tm, stations: awsResults, typhoons }), {
        headers: { ...CORS, 'Cache-Control': 'public, max-age=300' }
      });
    }

    if (url.pathname === '/forecast') {
      const cityName = url.searchParams.get('city') || '서울';
      const cities = [{name:'서울',nx:60,ny:127},{name:'부산',nx:98,ny:76},{name:'대구',nx:89,ny:90},{name:'인천',nx:55,ny:124},{name:'광주',nx:58,ny:74},{name:'대전',nx:67,ny:100},{name:'울산',nx:102,ny:84},{name:'수원',nx:60,ny:121},{name:'창원',nx:90,ny:77},{name:'전주',nx:63,ny:89},{name:'청주',nx:69,ny:107},{name:'포항',nx:102,ny:94}];
      const city = cities.find(c=>c.name===cityName) || cities[0];
      const kst = new Date(Date.now()+9*3600000);
      const pad = n=>String(n).padStart(2,'0');
      const bd = `${kst.getUTCFullYear()}${pad(kst.getUTCMonth()+1)}${pad(kst.getUTCDate())}`;
      // 가장 최근 단기예보 발표시각 (0200/0500/0800/1100/1400/1700/2000/2300)
      const hours = [2,5,8,11,14,17,20,23];
      const h = kst.getUTCHours();
      const baseH = [...hours].reverse().find(x=>x<=h) ?? 23;
      const bt = pad(baseH)+'00';
      // 전날 2300 발표 사용 (당일 이른 시간 대응)
      const fetchDate = baseH===23 && h<2 ?
        `${kst.getUTCFullYear()}${pad(kst.getUTCMonth()+1)}${pad(kst.getUTCDate()-1)}` : bd;
      try {
        const p = new URLSearchParams({serviceKey:env.DATA_GO_KEY,pageNo:1,numOfRows:1000,dataType:'JSON',base_date:fetchDate,base_time:bt,nx:city.nx,ny:city.ny});
        const r = await fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${p}`,{signal:AbortSignal.timeout(8000)});
        const d = await r.json();
        const items = d?.response?.body?.items?.item||[];
        // 날짜별로 TMX/TMN/POP/PTY/SKY 집계
        const byDate = {};
        items.forEach(it=>{
          const dt = it.fcstDate;
          if(!byDate[dt]) byDate[dt]={tmx:null,tmn:null,pop:[],pty:[],sky:[]};
          if(it.category==='TMX') byDate[dt].tmx=parseFloat(it.fcstValue);
          if(it.category==='TMN') byDate[dt].tmn=parseFloat(it.fcstValue);
          if(it.category==='POP') byDate[dt].pop.push(parseInt(it.fcstValue)||0);
          if(it.category==='PTY') byDate[dt].pty.push(parseInt(it.fcstValue)||0);
          if(it.category==='SKY') byDate[dt].sky.push(parseInt(it.fcstValue)||0);
        });
        const days = Object.keys(byDate).sort().slice(0,4).map(dt=>({
          date:dt,
          tmx:byDate[dt].tmx,
          tmn:byDate[dt].tmn,
          pop:byDate[dt].pop.length?Math.max(...byDate[dt].pop):0,
          pty:byDate[dt].pty.some(v=>v>0)?Math.max(...byDate[dt].pty):0,
          sky:byDate[dt].sky.length?Math.round(byDate[dt].sky.reduce((a,b)=>a+b,0)/byDate[dt].sky.length):1,
        }));
        return new Response(JSON.stringify({city:city.name,days}),{headers:{...CORS,'Cache-Control':'public, max-age=1800'}});
      } catch(e) {
        return new Response(JSON.stringify({city:city.name,days:[]}),{headers:CORS});
      }
    }

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

    // /elevators/summary — Tier 1: 시군구별 집계 (전국보기 줌1-7)
    // Worker 인라인 상수 (880K건 사전계산, Mac mini 빌드)
    if (url.pathname === '/elevators/summary') {
      return new Response(JSON.stringify(SUMMARY_CACHE), {
        headers: { ...CORS, 'Cache-Control': 'public, max-age=1800' },
      });
    }

    // /elevators/bbox?n=&s=&e=&w=&limit= — Tier 3: viewport 박스 내 포인트 (줌 12+)
    // R2 전체 캐시에서 bbox 필터링 → 최대 limit(기본2000)건 반환
    if (url.pathname === '/elevators/bbox') {
      const n = parseFloat(url.searchParams.get('n') || '38.5');
      const s = parseFloat(url.searchParams.get('s') || '33');
      const e = parseFloat(url.searchParams.get('e') || '130');
      const w = parseFloat(url.searchParams.get('w') || '125');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '2000'), 5000);
      try {
        const obj = await env.ELEV_CACHE.get(R2_KEY);
        if (obj) {
          const ds = new DecompressionStream('gzip');
          const text = await new Response(obj.body.pipeThrough(ds)).text();
          const data = JSON.parse(text);
          const pts = (data.points || [])
            .filter(p => p.lat >= s && p.lat <= n && p.lng >= w && p.lng <= e)
            .slice(0, limit);
          return new Response(JSON.stringify({ ts: Date.now(), total: pts.length, points: pts }), {
            headers: { ...CORS, 'Cache-Control': 'public, max-age=300' },
          });
        }
      } catch(e) {}
      return new Response(JSON.stringify({ ts: Date.now(), total: 0, points: [] }), { headers: CORS });
    }

    // /forecast — 주요 도시 3일 단기예보 (기온 TMX/TMN + 강수확률 POP)
    if (url.pathname === '/forecast') {
      const cities = [
        {name:'서울',nx:60,ny:127},{name:'부산',nx:98,ny:76},{name:'대구',nx:89,ny:90},
        {name:'인천',nx:55,ny:124},{name:'광주',nx:58,ny:74},{name:'대전',nx:67,ny:100},
        {name:'울산',nx:102,ny:84},{name:'수원',nx:60,ny:121},{name:'창원',nx:90,ny:77},
        {name:'전주',nx:63,ny:89},{name:'청주',nx:69,ny:107},{name:'포항',nx:102,ny:94},
      ];
      const kst = new Date(Date.now() + 9*3600000);
      const pad = n => String(n).padStart(2,'0');
      const bd = `${kst.getUTCFullYear()}${pad(kst.getUTCMonth()+1)}${pad(kst.getUTCDate())}`;
      // 단기예보 발표 기준시: 02/05/08/11/14/17/20/23시 중 현재 이전 가장 가까운 것
      const fcHours = [2,5,8,11,14,17,20,23];
      const nowH = kst.getUTCHours();
      const fcH = [...fcHours].reverse().find(h => h <= nowH) ?? 23;
      const fcDate = fcH === 23 && nowH < 23
        ? (() => { const d = new Date(kst); d.setUTCDate(d.getUTCDate()-1); return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}`; })()
        : bd;
      const bt = `${pad(fcH)}00`;

      // 3일치 날짜 배열
      const days = Array.from({length:3}, (_,i) => {
        const d = new Date(kst); d.setUTCDate(d.getUTCDate() + i);
        return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}`;
      });

      const results = await Promise.all(cities.map(async c => {
        try {
          const p = new URLSearchParams({
            serviceKey: env.DATA_GO_KEY, pageNo:1, numOfRows:1000,
            dataType:'JSON', base_date:fcDate, base_time:bt, nx:c.nx, ny:c.ny
          });
          const r = await fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${p}`,
            {signal: AbortSignal.timeout(8000)});
          const d = await r.json();
          const items = d?.response?.body?.items?.item || [];
          // 날짜별 TMX(최고)/TMN(최저)/POP(강수확률) 수집
          const byDay = {};
          days.forEach(dt => { byDay[dt] = {tmx:null,tmn:null,pop:[]}; });
          items.forEach(it => {
            if (!byDay[it.fcstDate]) return;
            if (it.category==='TMX') byDay[it.fcstDate].tmx = parseFloat(it.fcstValue);
            if (it.category==='TMN') byDay[it.fcstDate].tmn = parseFloat(it.fcstValue);
            if (it.category==='POP') byDay[it.fcstDate].pop.push(parseInt(it.fcstValue)||0);
            if (it.category==='SKY' && !byDay[it.fcstDate].sky) byDay[it.fcstDate].sky = parseInt(it.fcstValue);
            if (it.category==='PTY' && !byDay[it.fcstDate].pty) byDay[it.fcstDate].pty = parseInt(it.fcstValue);
          });
          const forecast = days.map(dt => {
            const v = byDay[dt];
            const maxPop = v.pop.length ? Math.max(...v.pop) : 0;
            return { date:dt, tmx:v.tmx, tmn:v.tmn, pop:maxPop, sky:v.sky, pty:v.pty };
          });
          return { name:c.name, forecast };
        } catch { return { name:c.name, forecast:[] }; }
      }));

      return new Response(JSON.stringify({ ts:Date.now(), days, cities:results }), {
        headers: { ...CORS, 'Cache-Control':'public, max-age=3600' }
      });
    }

    return new Response('BTR Flood Alert Worker v3', { headers: {'Content-Type':'text/plain'} });
  },
};
