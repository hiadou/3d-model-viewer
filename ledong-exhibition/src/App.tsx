import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import {
  ExternalLink, Phone, Mail, MapPin, ChevronDown, Clock,
  Landmark, Archive, Shield, TreePine, ArrowUp,
  X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ── 3D 模型配置 ── */
const models3d = [
  { id: 'tssw', title: '黄道婆三线纺车', desc: '元代黄道婆革新三锭脚踏纺车，体现海南古代棉纺织技术的智慧结晶', src: './glb/TSSW.html?v=4' },
  { id: 'loom', title: '黄道婆织布机', desc: '经过黄道婆改良的高效织布机，推动了松江府棉纺织业的繁荣', src: './glb/H.D.Loom.html?v=4' },
  { id: 'lb', title: '民族带织品踞腰织机', desc: '海南黎族同胞传统踞腰织机，是人类纺织史上最古老的织造工具之一', src: './glb/LB.html?v=4' },
  { id: 'hairpin', title: '民族带穗琉璃珠串六叉刻花骨簪', desc: '黎族同胞传统骨簪工艺，六叉刻花纹饰精细，琉璃珠串色彩斑斓', src: './glb/six-pronged.html?v=4' },
  { id: 'pottery', title: '圆底植物质陶釜', desc: '海南先民使用的陶制炊器，见证了早期定居农耕文明的发展', src: './glb/RB-PFC.html?v=4' },
];

/* ── 图片数据（统一带tag） ── */
const allImages = [
  { src: './img/garden/白沙河谷大门_01.webp', alt: '白沙河谷大门', label: '白沙河谷大门', tag: 'garden' },
  { src: './img/garden/红砖桥.webp', alt: '红砖桥', label: '红砖桥', tag: 'garden' },
  { src: './img/garden/石祖屋.webp', alt: '石祖屋', label: '石祖屋', tag: 'garden', description: '"石祖"是黎族父权的象征，是祖先和生殖力的象征。在黎族村子门前或在大榕树下，常有一间既小又矮的小石屋，用几块石头筑成，这是黎族人民经常朝拜的土地庙。庙里既没有神位也没有香炉，只有一个石头雕刻的形状像男性生殖器的石头，黎族人称为"石祖"。' },
  { src: './img/garden/南海神针.webp', alt: '南海神针', label: '南海神针', tag: 'garden' },
  { src: './img/garden/崖州藏美石.webp', alt: '崖州藏美石', label: '崖州藏美石', tag: 'garden' },
  { src: './img/garden/黎族干栏屋.webp', alt: '黎族干栏屋', label: '黎族干栏屋', tag: 'garden', description: '干栏式民居是黎族同胞世代沿袭的传统住宅形式，其风格别具一格。早在宋代，文献中就已出现黎族建造此类房屋的记载，这种住宅作为黎族最古老的居住样式之一，完全契合了当地的自然环境。步入黎族村落，随处可见以竹木搭建的二层建筑：上层作为起居空间供人居住，下层则用于饲养家禽家畜或堆放杂物；部分房屋前方围设长栏杆，侧面还建有晒台。历史上，这类建筑被统称为"干栏"。中国古代百越族群常年生活在河网密布、潮湿多雨的环境中，干栏建筑正是他们在长期实践中创制出的、适应南方气候的民族特色居所。在海南黎族地区，干栏已成为重要的文化象征。它不仅是建筑形制的代表，更融合了黎族经济、技术、艺术、哲学、历史等多重元素，承载着深厚的文化内涵，并保存了民族过往活动的珍贵史料与历史信息。根据外观造型，黎族干栏可划分为船型屋与金字型屋两大类；依架设高度不同，又分为高架船型屋与低架船型屋。传统建筑类型包括住房、隆闺（青年男女居所）、谷仓、畜栏等。至今，黎族村寨中仍留存大量干栏建筑。这些房屋顺应地形起伏，应对炎热潮湿气候，使用当地随手可得的建材，并注重生态环境，处处体现出人与自然的和谐共生，展现出顽强的生命力。' },
  { src: './img/garden/母系屋.webp', alt: '母系屋', label: '母系屋', tag: 'garden' },
  { src: './img/garden/历史馆.webp', alt: '历史馆', label: '历史馆', tag: 'garden' },
  { src: './img/garden/非遗馆.webp', alt: '非遗馆', label: '非遗馆', tag: 'garden' },
  { src: './img/garden/独桥.webp', alt: '独桥', label: '独桥', tag: 'garden' },
  { src: './img/garden/神石.webp', alt: '神石', label: '神石', tag: 'garden' },
  { src: './img/hall/南海会馆展陈.webp', alt: '南海会馆展陈', label: '南海会馆展陈', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_01.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ①', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_02.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ②', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_03.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ③', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_04.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ④', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_05.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ⑤', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_06.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ⑥', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_07.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ⑦', tag: 'hall' },
  { src: './img/hall/历史馆一层展陈_08.webp', alt: '历史馆一层展陈', label: '历史馆一层展陈 ⑧', tag: 'hall' },
  { src: './img/hall/历史馆二层展陈_01.webp', alt: '历史馆二层展陈', label: '历史馆二层展陈 ①', tag: 'hall' },
  { src: './img/hall/历史馆二层展陈_02.webp', alt: '历史馆二层展陈', label: '历史馆二层展陈 ②', tag: 'hall' },
  { src: './img/hall/历史馆二层展陈_03.webp', alt: '历史馆二层展陈', label: '历史馆二层展陈 ③', tag: 'hall' },
  { src: './img/hall/历史馆二层展陈_04.webp', alt: '历史馆二层展陈', label: '历史馆二层展陈 ④', tag: 'hall' },
  { src: './img/hall/非遗馆一层展陈_01.webp', alt: '非遗馆一层展陈', label: '非遗馆一层展陈 ①', tag: 'hall' },
  { src: './img/hall/非遗馆二层展陈_01.webp', alt: '非遗馆二层展陈', label: '非遗馆二层展陈 ①', tag: 'hall' },
  { src: './img/hall/非遗馆二层展陈_02.webp', alt: '非遗馆二层展陈', label: '非遗馆二层展陈 ②', tag: 'hall' },
  { src: './img/hall/非遗馆二层展陈_03.webp', alt: '非遗馆二层展陈', label: '非遗馆二层展陈 ③', tag: 'hall' },
];

const filterTags = [
  { key: 'all', label: '全部' },
  { key: 'garden', label: '园内景观' },
  { key: 'hall', label: '馆内景观' },
];

/* ── 数字藏品数据 ── */
interface CollectionItem {
  id: string;
  title: string;
  category: string;
  dynasty: string;
  image: string;
  description: string;
}

const collectionItems: CollectionItem[] = [
  {
    id: 'FL1007',
    title: '美孚方言女头巾',
    category: '织绣',
    dynasty: '清',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E7%BE%8E%E5%AD%9A%E6%96%B9%E8%A8%80%E5%A5%B3%E5%A4%B4%E5%B7%BE%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFL1007%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E7%BB%87%E7%BB%A3%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%B8%85.webp',
    description: '美孚方言女头巾作为黎族美孚支系女性最具视觉识别度的服饰符号，其传统头饰以黑白双色为基调，巧妙融合了独特的绞缬染（即扎染）工艺。该工艺创新性地实现了"扎经、染色、织造"三步流程的一体化，从而孕育出别具一格的黑色底白花纹样，在我国民族纺织体系中占据着不可替代的地位。在日常生活中，美孚妇女习惯将此类头巾缠裹于头部，并辅以银质头簪与耳环进行点缀，下身则搭配及踝的长筒裙，整体着装风格浑然一体。头巾表面织有多种几何图案，借由黑白强烈的色彩对比，既强化了图案的秩序感，又提升了装饰美感。织造过程依托于古老的踞腰织机（腰机）完成。其织锦工艺与同支系筒裙所用技法同源，先在专用扎染架上固定图案进行浸染，待拆线露出几何纹理后，再上机织造。其中，"黑地白花对称斗鹿纹"与"黑地白花连体祖先纹"等纹样尤为经典，极具代表性。美孚方言绞缬染头巾不仅是黎族纺织技艺的实物见证，更是绞缬染（扎经染）与踞腰织造两大核心技术的集大成者。作为黎族服饰文化的关键载体，它在探究海南少数民族的染织技术演进、服饰形制演变以及各支系文化差异等方面，具备极高的学术研究价值。',
  },
  {
    id: 'FL4002',
    title: '黎族宽口鼓腹圆底陶锅',
    category: '低温陶',
    dynasty: '清',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E9%BB%8E%E6%97%8F%E5%AE%BD%E5%8F%A3%E9%BC%93%E8%85%B9%E5%9C%86%E5%BA%95%E9%99%B6%E9%94%85%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFL4002%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E4%BD%8E%E6%B8%A9%E9%99%B6%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%B8%85.webp',
    description: '黎族宽口鼓腹圆底陶锅，又称黎陶或土陶，是中华陶艺文化的重要组成部分，由海南黎族先民创造并沿用数千年的传统低温陶器。其采用古老的手工捏制工艺，选黏土细筛、搓揉成型后，置于平地露天以草木堆烧，火候较低且不均，属典型的早期制陶技术遗存，体现了黎族先民源远流长的制陶智慧。在数千年发展历程中，黎族制陶技艺与中原及南方各族制陶传统交流互鉴、兼收并蓄，是各民族文化相通、经济相依的生动见证，体现了中华文明多元一体的深厚格局。该陶锅器型宽口、腹部圆润、底部呈弧形，便于安放于三石构成的简易灶台上进行炊煮，是旧时代黎家煮饭必备之器。制作工具简朴，多由家庭妇女传承制作，兼具实用性与交换价值。虽在现代生活中逐渐淡出，但在黎族杞方言等偏远山区，它不仅是生活用品，更承载着深厚的文化内涵，作为承载族群记忆的重要器物用于传统仪式，寄托着黎族人民对美好生活的朴素追求，是中华民族共有精神家园中的独特文化记忆。作为海南黎族传承保留的早期制陶技术体系珍贵遗存，此陶锅见证了中国南方早期陶艺的发展，具有极高的历史、民俗及考古研究价值。中华文化是主干，各民族文化是枝叶，根深干壮才能枝繁叶茂。这件古朴的陶器，正是各民族交往交流交融、共同创造灿烂中华文化的生动缩影，是中华优秀传统文化的珍贵遗产。',
  },
  {
    id: 'FL0270',
    title: '黎族双首刻花骨簪',
    category: '骨角牙器',
    dynasty: '清',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E9%BB%8E%E6%97%8F%E5%8F%8C%E9%A6%96%E5%88%BB%E8%8A%B1%E9%AA%A8%E7%B0%AA%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFL0270%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E9%AA%A8%E8%A7%92%E7%89%99%E5%99%A8%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%B8%85.webp',
    description: '以兽骨脱脂后手工雕刻而成，是黎族妇女盘髻的实用头饰。主要流行于"润""美孚""哈"三个方言区，款制多样：有人形簪，簪头刻出眉眼与发髻，自成一个小人；有素面无纹的素簪；有单针簪、四叉簪，以及形如梳齿的骨梳。白沙县润方言区的人形骨簪刻工最精，存世量也最多。骨簪不止别头发——簪身浮雕缠上彩色丝穗与珠串，走起路来随步轻晃，是黎族女性日常梳妆里最招眼的一件。它还是定情之物，青年男子亲手刻簪送与心仪的姑娘，姑娘插上发间，便算将两人的关系示与族人。黎族丧俗中另有一则细节：逝者下葬前，家人会将其生前佩戴的骨簪磕碎，一同入土，意为那边还用得着。入非遗前，这些簪子已经在黎家女子的发髻上别了数百年。',
  },
  {
    id: 'FG4006',
    title: '天后庙大铁钟',
    category: '铁器',
    dynasty: '清',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E5%A4%A9%E5%90%8E%E5%BA%99%E5%A4%A7%E9%93%81%E9%92%9F%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFG4006%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E9%93%81%E5%99%A8%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%B8%85.webp',
    description: '天后庙铁钟：铸于清·同治九年（1870年），通高66厘米，底径50厘米。钟作简圆筒形，蒲牢钮，身饰缠枝卷云纹，两侧分铸阳文"风调雨顺""国泰民安"，中部圆形开光，近口弦纹，钟口外侈。铁质斑驳，古拙凝重。天后（妈祖）为沿海最盛行之海神信仰，八字铭文寄托祈海安澜、国泰民安之愿，是考证庙宇年代、海洋社会与海上商贸的实物标本。',
  },
  {
    id: 'FL4015',
    title: '黎族敞口束腰高足豆',
    category: '陶器',
    dynasty: '清',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E9%BB%8E%E6%97%8F%E6%95%9E%E5%8F%A3%E6%9D%9F%E8%85%B0%E9%AB%98%E8%B6%B3%E8%B1%86%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFL4015%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E9%99%B6%E5%99%A8%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%B8%85.webp',
    description: '敞口浅盘，腹壁斜收，下承束腰高柄，柄底外撇成喇叭形圈足，足壁近底处穿一小圆孔。口径 29 厘米、通高 13 厘米，口广而身扁，口沿微有起伏，是手工成型的痕迹。“豆”本为古代中原高柄盛食器之名，此器即因敞口高柄的形制得名——中原与海南虽隔山海，器物的命名却彼此相通，是中华文化共同体内相互呼应的一个细节。此器为清代黎族制陶作品，出自黄流新建村。海南新石器时代遗址出土的陶器已有六千年以上历史；白沙、昌江等地尚存的片贴法与泥条盘筑法制陶，是这一古老技艺的延续。旧时制陶多由妇女承担，烧陶期间曾有男性回避的旧俗；陶坯晾干后露天架柴烧制，火温约 800℃，出火趁热淋上黎语称“塞柴涯”“柴构仁”的植物汁液，使器身坚固耐用。器表红褐与灰褐相间，内壁色深，外壁局部泛白，是露天堆烧、受火不匀留下的痕迹；内底隐约可见盘筑成型的环状接痕。通体手制，不施釉，亦不经轮修。黎族陶器以釜、罐、瓮、碗、缸、蒸酒器等炊煮盛储之器为大宗，此器以高柄托起浅盘，造型舒展，在实用器群中自具面貌。放眼中华大地，制陶技艺源远流长、多元一体。中原及南方各地的早期制陶传统在历史进程中不断革新演变，而海南黎族地区因海岛生计与生活需要，长期沿用泥条盘筑、露天堆烧的古法，成为中华陶艺谱系中一支传承有绪、别具面貌的地方支脉。2006 年，黎族原始制陶技艺列入第一批国家级非物质文化遗产名录（海南省昌江黎族自治县申报）；今天，这一技艺仍在昌江等地由传承人延续。中华文化是主干，各民族文化是枝叶，根深干壮才能枝繁叶茂。这件陶豆，记下的既是海南先民数千年的制陶历程，也是各民族共同创造灿烂中华文化的生动一页。',
  },
  {
    id: 'FG4029',
    title: '三耳三蛙铜锣',
    category: '金属器（青铜）',
    dynasty: '明',
    image: './img/collections/%E5%90%8D%E7%A7%B0%EF%BC%9A%E4%B8%89%E8%80%B3%E4%B8%89%E8%9B%99%E9%93%9C%E9%94%A3%EF%BC%9B%E7%BC%96%E5%8F%B7%EF%BC%9AFG4029%EF%BC%9B%E7%B1%BB%E5%88%AB%EF%BC%9A%E9%87%91%E5%B1%9E%E5%99%A8%EF%BC%88%E9%9D%92%E9%93%9C%EF%BC%89%EF%BC%9B%E5%B9%B4%E4%BB%A3%EF%BC%9A%E6%98%8E.webp',
    description: '锣面自边沿向中心斜收，中央微微隆起，面径30.5厘米，通高仅4厘米；锣边附三个耳，作蛙形。锣心现存一道裂纹。通体为铜质，锈色青碧斑驳。古籍称这类小铜锣为“黎金”。清光绪《崖州志》引《虞衡志》：“黎金，形似铜鼓而扁小，上有三耳。黎人击之以为号。”清人李调元《南越笔记》以之为“铛”，并谓“富者鸣铜鼓，贫者鸣铛，以为聚会之乐”；同书又记其“上三耳，中微其脐”。“铛”本为古代中原对小型铜乐器的通称：中原以“铛”名之，黎人以“黎金”“锣精”称之。一器数名，说明海南与内地之间的器用知识早已相通，器物虽小，来路却长。蛙是黎族崇奉的动物之一：蛙鸣即雨，故以之祈风调雨顺；蛙产子繁盛，故以之祝多子多孙。这种对蛙的珍视并非黎族独有——南方许多民族皆有蛙崇拜，铜鼓鼓沿铸蛙更是南方铜鼓文化的共同传统，海南陵水等地出土的云雷纹四蛙铜鼓即属此系。黎族器物上铸塑的蛙不止于此器：铜鼓鼓沿铸立体小蛙，陶缸、陶罐器身塑青蛙，织锦与文身亦多蛙纹——黎族少女旧有文身之俗，青蛙即其文身的主要图案。旧时黎族村峒有锣有鼓，遇事击以集众。锣是财富与身份的象征：《崖州志》记“最贵蛤锣，豪强之家有以十数牛易一锣者”，一锣可易牛十数头，亦可用作婚娶聘礼。黎族地区旧称带花纹的铜锣为“锣精”，又叫“青蛙铜锣”；过去赶鬼驱邪时敲“锣精”，有的地方在死者入殓时还将它枕在头下。过去每逢佳节，亩头以米酒洗锣，此酒名“福魂酒”，并与合亩内的人共饮。锣多自内地输入，黎族人常以大牛与汉族商人相易；明清之际海南与大陆的贸易沉船上，也曾出水同样的铜锣——一器之微，连着的是各民族之间长久的往来。这面小锣，既记录了黎族先民的信仰与生活，也是各民族共同创造灿烂中华文化的实物见证。',
  },
];

const collectionCategories = [
  { key: 'all', label: '全部' },
  { key: '陶瓷', label: '陶瓷' },
  { key: '低温陶', label: '低温陶' },
  { key: '陶器', label: '陶器' },
  { key: '织绣', label: '织绣' },
  { key: '骨角牙器', label: '骨角牙器' },
  { key: '木器', label: '木器' },
  { key: '金属器（青铜）', label: '金属器（青铜）' },
  { key: '铁器', label: '铁器' },
  { key: '石玉器', label: '石玉器' },
];

const collectionDynasties = [
  { key: 'all', label: '全部' },
  { key: '新石器', label: '新石器' },
  { key: '战国', label: '战国' },
  { key: '汉', label: '汉' },
  { key: '唐', label: '唐' },
  { key: '宋', label: '宋' },
  { key: '元', label: '元' },
  { key: '明', label: '明' },
  { key: '清', label: '清' },
  { key: '近代', label: '近代' },
];

/* ── 导航项 ── */
const navItems = [
  { id: 'intro', label: '概览' },
  { id: 'gallery', label: '园内景观' },
  { id: 'gallery-hall', label: '馆内景观' },
  { id: 'collections', label: '数字藏品' },
  { id: 'exhibits3d', label: '3D展陈' },
  { id: 'contact', label: '联系' },
];

export default function App() {
  const [activeModel, setActiveModel] = useState(models3d[0].id);
  const [lightboxOpen, setLightboxOpen] = useState<string | null>(null);
  const [collectionLightbox, setCollectionLightbox] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState('all');
  const [collectionCategory, setCollectionCategory] = useState('all');
  const [collectionDynasty, setCollectionDynasty] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'collections'>('home');

  useEffect(() => {
    if (currentPage === 'collections') {
      setActiveSection('collections');
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = navItems.map((n) => document.getElementById(n.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cn.vercount.one/js';
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'collections') {
      setCurrentPage('collections');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage('home');
    if (id === 'gallery-hall') {
      setFilterTag('hall');
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'gallery') {
      setFilterTag('garden');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 园内/馆内景观导航项共用 #gallery 区块，用筛选标签区分当前高亮项
  const activeNavItem = activeSection === 'gallery' && filterTag === 'hall' ? 'gallery-hall' : activeSection;
  const activeModelData = models3d.find((m) => m.id === activeModel) ?? models3d[0];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ═══════ 固定导航栏 ═══════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: (scrolled || currentPage === 'collections') ? 'hsla(36, 33%, 97%, 0.95)' : 'transparent',
          backdropFilter: (scrolled || currentPage === 'collections') ? 'blur(8px)' : 'none',
          borderBottom: (scrolled || currentPage === 'collections') ? '1px solid hsl(30, 20%, 85%)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-4 flex items-center justify-between h-14">
          <span
            className="font-serif font-bold text-sm cursor-pointer shrink-0 mr-1"
            style={{ color: (scrolled || currentPage === 'collections') ? 'hsl(15, 60%, 35%)' : 'white', opacity: (scrolled || currentPage === 'collections') ? 1 : 0.5 }}
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            白沙河谷
          </span>
          <div className="flex gap-0.5 md:gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-1.5 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors shrink-0"
                style={{
                  color: activeNavItem === item.id
                    ? 'hsl(15, 60%, 35%)'
                    : (scrolled || currentPage === 'collections') ? 'hsl(20, 14%, 30%)' : 'hsla(0, 0%, 100%, 0.7)',
                  background: activeNavItem === item.id ? 'hsla(15, 60%, 35%, 0.1)' : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {currentPage === 'home' && (<>

      {/* ═══════ Hero — 背景图版 ═══════ */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        {/* 背景图 */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="./img/garden/白沙河谷大门.webp"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.25) saturate(0.8)' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(20,14,10,0.6) 100%)',
          }} />
        </div>

        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 w-full h-1 z-10"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(30,70%,55%), hsl(15,60%,35%), transparent)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-6">
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1.5 font-medium tracking-wider"
              style={{ background: 'hsla(15, 60%, 35%, 0.9)', color: 'white', border: '1px solid hsla(30, 70%, 55%, 0.3)' }}
            >
              海南省社会科学普及基地
            </Badge>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            白沙河谷
            <br />
            <span style={{ color: 'hsl(30, 70%, 60%)' }}>生态博物馆</span>
          </h1>

          <blockquote className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed italic border-l-4 px-6 text-left"
            style={{ borderColor: 'hsl(30, 70%, 55%)', color: 'hsla(0, 0%, 90%, 0.85)' }}
          >
            "每一种文明都延续着一个国家和民族的精神血脉，既需要薪火相传、代代守护，更需要与时俱进、勇于创新。"
          </blockquote>

          <div className="w-24 h-px mx-auto my-8" style={{ background: 'linear-gradient(90deg, transparent, hsl(30,70%,55%), transparent)' }} />

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: 'hsla(0, 0%, 85%, 0.8)' }}>
            <MapPin className="w-4 h-4" style={{ color: 'hsl(30, 70%, 60%)' }} />
            <span>乐东县佛罗白沙河大桥北桥头（225国道海榆西线312公里处）</span>
          </div>

          <div className="mt-10 animate-bounce">
            <ChevronDown className="w-6 h-6 mx-auto" style={{ color: 'hsla(0, 0%, 80%, 0.6)' }} />
          </div>
        </div>
      </header>

      {/* ═══════ 博物馆概览 ═══════ */}
      <section className="py-16 md:py-24 px-4 scroll-mt-16" id="intro" style={{ background: 'linear-gradient(180deg, transparent, hsl(36,33%,97%))' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              博物馆<span style={{ color: 'hsl(15, 60%, 35%)' }}> 概览</span>
            </h2>
            <div className="decorative-line" />
          </div>

          <div className="space-y-8 text-base leading-relaxed text-foreground/90">
            <p className="animate-fade-in">
              海南灿烂的文化是各民族共同创造的。<strong>白沙河谷生态博物馆</strong>珍藏的5000余件文物，承载着黎汉各族人民交往交流交融的深厚历史记忆，是中华优秀传统文化在海南绵延发展的生动见证，是构筑中华民族共有精神家园的重要载体。
            </p>

            {[
              {
                icon: MapPin, title: '地理位置与园区',
                content: [
                  '白沙河谷本土文化园，位于225国道海榆西线312公里，佛罗与尖峰交界白沙大桥北端，隔着白沙河与龙沐湾相望。南去佛罗镇6公里，北至G98高速公路尖峰互通仅6公里。文化园占地面积25亩，园地景观原始自然，灌木林、植物草本等生态水系资源十分丰富。',
                  '经博物馆历时四十年间不间断种植和培育，植物树种草本足有<strong>300多种</strong>，其中包括海南沉香树种和160多棵已成年树龄的海南较为珍稀的黄花梨大树。文化园中间有山丘、河谷沟、清冷泉水、水草湿地等地域资源，水量充沛。',
                ],
              },
              {
                icon: Landmark, title: '历史文化资源',
                content: [
                  '园内有崖感志书都有确切记载的<strong>甘泉驿古旧遗址</strong>，内有古甘泉，称"崖州第一泉"，并有古井、古陶窑遗址等历史资源。还建有黎族母系屋、干栏屋、石祖塔、南海神针等承载着黎族悠久历史文化的人文景观，它们是中华文化百花园中的独特组成部分，也是各民族文化互鉴融通的历史见证。',
                ],
              },
              {
                icon: Archive, title: '馆藏文物',
                content: [
                  '历经四十年深入挖掘收集、保护、展示的<strong>5000多件</strong>海南本土黎族、汉族历史文化文物。从历史上追溯到海南旧石器晚期打制的石具器物和新石器时期打磨的各类器物。包括植物质陶、椰壳陶、低湿陶、战国绳纹青铜器、玛瑙珠、木刻字、图雕版、崖州布、崖州民歌古版本及黎族传统手工制作的树皮布、麻、棉纺织物等各类文物5000多件（套）。',
                ],
              },
              {
                icon: Shield, title: '保护与展示',
                content: [
                  '近几年来，博物馆经过多方面自筹资金，并在同时得到省、县各级政府及相关部门的资金帮扶下，先后建造了二座1000平方米的文物建筑博物馆，使"白沙河谷"的海南本土独特地域历史文化文物，得到了很好的展示与保护。',
                  '<strong>白沙河谷生态博物馆虽小，但却是"小河谷，大文化"的实体文化规模</strong>，已成为展示中华优秀传统文化在海南传承发展的重要窗口。',
                ],
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'backwards' }}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <card.icon className="w-6 h-6" style={{ color: 'hsl(15, 60%, 35%)' }} />
                    <h3 className="font-serif text-xl font-bold" style={{ color: 'hsl(15, 60%, 35%)' }}>{card.title}</h3>
                  </div>
                  {card.content.map((txt, j) => (
                    <p key={j} className={j > 0 ? 'mt-4' : ''} dangerouslySetInnerHTML={{ __html: txt }} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 景观展示（标签筛选） ═══════ */}
      <section className="py-16 md:py-24 px-4 scroll-mt-16" id="gallery">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              园内<span style={{ color: 'hsl(15, 60%, 35%)' }}> · 馆内</span><span style={{ color: 'hsl(15, 60%, 35%)' }}>景观</span>
            </h2>
            <div className="decorative-line" />
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">点击图片查看大图 · 点击标签筛选</p>
          </div>

          {/* 标签筛选栏 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filterTags.map((t) => {
              const count = t.key === 'all' ? allImages.length : allImages.filter((img) => img.tag === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setFilterTag(t.key)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: filterTag === t.key ? 'hsl(15, 60%, 35%)' : 'hsl(36, 20%, 92%)',
                    color: filterTag === t.key ? 'white' : 'hsl(20, 14%, 20%)',
                  }}
                >
                  {t.label} <span style={{ opacity: 0.6 }}>· {count}</span>
                </button>
              );
            })}
          </div>

          {/* 图片网格 */}
          {(() => {
            const filtered = filterTag === 'all' ? allImages : allImages.filter((img) => img.tag === filterTag);
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((img, i) => (
                  <Card
                    key={img.src}
                    className="overflow-hidden border-0 shadow-sm group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
                    onClick={() => setLightboxOpen(img.src)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">{img.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>

        {/* 灯箱 */}
        {lightboxOpen && (() => {
          const currentImage = allImages.find((img) => img.src === lightboxOpen);
          const hasDescription = currentImage?.description != null;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
              onClick={() => setLightboxOpen(null)}
            >
              <button
                onClick={() => setLightboxOpen(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10 rounded-full p-2"
              >
                <X className="w-8 h-8" />
              </button>

              {hasDescription ? (
                <div
                  className="flex flex-col md:flex-row max-w-5xl w-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="md:w-3/5 bg-black/90 flex items-center justify-center p-2">
                    <img
                      src={lightboxOpen}
                      alt={currentImage?.alt || ''}
                      className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain"
                    />
                  </div>
                  <div
                    className="md:w-2/5 flex flex-col justify-start md:justify-center p-6 md:p-8 overflow-y-auto"
                    style={{ background: 'hsla(36, 33%, 97%, 0.96)' }}
                  >
                    <h3
                      className="font-serif text-xl md:text-2xl font-bold mb-3"
                      style={{ color: 'hsl(15, 60%, 35%)' }}
                    >
                      {currentImage?.label}
                    </h3>
                    <div className="w-12 h-px mb-4" style={{ background: 'hsl(30, 70%, 55%)' }} />
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: 'hsl(20, 14%, 30%)' }}>
                      {currentImage?.description}
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={lightboxOpen}
                  alt=""
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          );
        })()}
      </section>

      </>)}

      {currentPage === 'collections' && (<>

      {/* ═══════ 数字藏品 ═══════ */}
      <section className="py-16 md:py-24 px-4 scroll-mt-16" id="collections" style={{ background: 'linear-gradient(180deg, transparent, hsl(25,30%,93%), transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">数字藏品</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              馆藏精品<span style={{ color: 'hsl(15, 60%, 35%)' }}> · 在线浏览</span>
            </h2>
            <div className="decorative-line" />
            <button
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0 }); }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'hsl(15, 60%, 35%)' }}
            >
              <span style={{ fontSize: '1.1em' }}>&larr;</span> 返回主页
            </button>
          </div>

          {/* 筛选栏 */}
          {collectionItems.length > 0 ? (
            <>
              <div className="flex flex-col items-center gap-4 mb-8">
                {/* 类别筛选 */}
                <div className="flex flex-wrap justify-center gap-2">
                  {collectionCategories.map((cat) => {
                    const count = cat.key === 'all' ? collectionItems.length : collectionItems.filter((item) => item.category === cat.key).length;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setCollectionCategory(cat.key)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                          background: collectionCategory === cat.key ? 'hsl(15, 60%, 35%)' : 'hsl(36, 20%, 92%)',
                          color: collectionCategory === cat.key ? 'white' : 'hsl(20, 14%, 20%)',
                        }}
                      >
                        {cat.label} <span style={{ opacity: 0.6 }}>· {count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 年代筛选 */}
                <div className="flex flex-wrap justify-center gap-2">
                  {collectionDynasties.map((dyn) => {
                    const count = dyn.key === 'all' ? collectionItems.length : collectionItems.filter((item) => item.dynasty === dyn.key).length;
                    return (
                      <button
                        key={dyn.key}
                        onClick={() => setCollectionDynasty(dyn.key)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                          background: collectionDynasty === dyn.key ? 'hsl(15, 60%, 35%)' : 'hsl(36, 20%, 92%)',
                          color: collectionDynasty === dyn.key ? 'white' : 'hsl(20, 14%, 20%)',
                        }}
                      >
                        {dyn.label} <span style={{ opacity: 0.6 }}>· {count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 藏品卡片网格 */}
              {(() => {
                const filtered = collectionItems.filter((item) => {
                  const catMatch = collectionCategory === 'all' || item.category === collectionCategory;
                  const dynMatch = collectionDynasty === 'all' || item.dynasty === collectionDynasty;
                  return catMatch && dynMatch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-20">
                      <Archive className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(20, 8%, 70%)' }} />
                      <p className="text-muted-foreground text-sm">暂无匹配藏品，请尝试其他筛选条件</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filtered.map((item, i) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden border-0 shadow-sm group cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'backwards' }}
                        onClick={() => setCollectionLightbox(item.id)}
                      >
                        <div className="aspect-[3/4] overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* 年代标签 */}
                          <span
                            className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium tracking-wider"
                            style={{ background: 'hsla(15, 60%, 35%, 0.88)', color: 'white' }}
                          >
                            {item.dynasty}
                          </span>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-serif text-sm font-bold mb-1.5 leading-snug" style={{ color: 'hsl(20, 14%, 15%)' }}>
                            {item.title}
                          </h3>
                          <p className="text-xs" style={{ color: 'hsl(20, 8%, 50%)' }}>
                            {item.id} · {item.category} · {item.dynasty}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </>
          ) : (
            /* 空态：等待藏品图片 */
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ background: 'hsl(36, 20%, 94%)' }}
              >
                <Archive className="w-10 h-10" style={{ color: 'hsl(20, 8%, 65%)' }} />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2" style={{ color: 'hsl(20, 14%, 25%)' }}>
                藏品数据准备中
              </h3>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'hsl(20, 8%, 50%)' }}>
                请将藏品图片放入 <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'hsl(36, 20%, 90%)', color: 'hsl(15, 60%, 35%)' }}>img/collections/</code> 目录，并在数据配置中添加对应的藏品信息
              </p>
            </div>
          )}
        </div>

        {/* 藏品灯箱 */}
        {collectionLightbox && (() => {
          const item = collectionItems.find((c) => c.id === collectionLightbox);
          if (!item) return null;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
              onClick={() => setCollectionLightbox(null)}
            >
              <button
                onClick={() => setCollectionLightbox(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10 rounded-full p-2"
              >
                <X className="w-8 h-8" />
              </button>

              <div
                className="flex flex-col md:flex-row max-w-5xl w-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="md:w-3/5 bg-black/90 flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain"
                  />
                </div>
                <div
                  className="md:w-2/5 flex flex-col justify-start md:justify-center p-6 md:p-8 overflow-y-auto"
                  style={{ background: 'hsla(36, 33%, 97%, 0.96)' }}
                >
                  {/* 标签行 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-medium"
                      style={{ background: 'hsla(15, 60%, 35%, 0.12)', color: 'hsl(15, 60%, 35%)' }}
                    >
                      {item.dynasty}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-medium"
                      style={{ background: 'hsla(30, 40%, 50%, 0.12)', color: 'hsl(30, 40%, 35%)' }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-xl md:text-2xl font-bold mb-3"
                    style={{ color: 'hsl(15, 60%, 35%)' }}
                  >
                    {item.title}
                  </h3>
                  <div className="w-12 h-px mb-4" style={{ background: 'hsl(30, 70%, 55%)' }} />
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'hsl(20, 14%, 30%)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      </>)}

      {currentPage === 'home' && (<>

      {/* ═══════ 3D 数字展陈 ═══════ */}
      <section className="py-16 md:py-24 px-4 scroll-mt-16" id="exhibits3d" style={{ background: 'linear-gradient(180deg, transparent, hsl(25,30%,93%), transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">3D 数字展陈</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              馆藏文物 <span style={{ color: 'hsl(15, 60%, 35%)' }}>三维预览</span>
            </h2>
            <div className="decorative-line" />
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              通过三维数字化技术，近距离观察展品细节，点击标签切换展品
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {models3d.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: activeModel === m.id ? 'hsl(15, 60%, 35%)' : 'hsl(36, 20%, 92%)',
                  color: activeModel === m.id ? 'white' : 'hsl(20, 14%, 20%)',
                }}
              >
                {m.title}
              </button>
            ))}
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-2 md:p-4">
              <iframe
                key={activeModel}
                src={activeModelData.src}
                className="model-viewer-frame w-full"
                title={activeModelData.title}
                allowFullScreen
                loading="lazy"
              />
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{activeModelData.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{activeModelData.desc}</p>
                  </div>
                  <a
                    href={activeModelData.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium shrink-0"
                    style={{ color: 'hsl(15, 60%, 35%)' }}
                  >
                    全屏查看 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════ 联系我们 ═══════ */}
      <section className="py-16 md:py-24 px-4 scroll-mt-16" id="contact">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            联系<span style={{ color: 'hsl(15, 60%, 35%)' }}>我们</span>
          </h2>
          <div className="decorative-line mb-10" />

          <Card className="border-0 shadow-sm animate-fade-in">
            <CardContent className="p-8 space-y-5">
              <div className="flex items-center justify-center gap-3 text-sm">
                <Clock className="w-4 h-4 shrink-0" style={{ color: 'hsl(15, 60%, 35%)' }} />
                <span>开放时间：<strong>09:00 – 18:00</strong></span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: 'hsl(15, 60%, 35%)' }} />
                <span>乐东县佛罗白沙河大桥北桥头（225 国道海榆西线 312 公里处）</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <a href="tel:0898-85701399" className="flex items-center gap-2 hover:underline" style={{ color: 'hsl(15, 60%, 35%)' }}>
                  <Phone className="w-4 h-4" /> 0898-85701399
                </a>
                <a href="tel:13907631399" className="flex items-center gap-2 hover:underline" style={{ color: 'hsl(15, 60%, 35%)' }}>
                  <Phone className="w-4 h-4" /> 13907631399
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <a href="mailto:13907631399@139.com" className="flex items-center gap-2 hover:underline" style={{ color: 'hsl(15, 60%, 35%)' }}>
                  <Mail className="w-4 h-4" /> 13907631399@139.com
                </a>
                <span className="flex items-center gap-2 text-muted-foreground">
                  传真：0898-85701476
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      </>)}

      {/* ═══════ 回到顶部 ═══════ */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          style={{ background: 'hsl(15, 60%, 35%)', color: 'white' }}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* ═══════ Footer ═══════ */}
      <footer className="py-12 px-4 text-center" style={{ background: 'hsl(20, 14%, 10%)', color: 'hsl(36, 20%, 85%)' }}>
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-xl font-bold mb-2" style={{ color: 'hsl(36, 33%, 97%)' }}>
            白沙河谷生态博物馆
          </h3>
          <p className="text-sm mb-6" style={{ color: 'hsl(30, 20%, 75%)' }}>
            小河谷，大文化
          </p>
          <div className="h-px w-24 mx-auto mb-6" style={{ background: 'hsl(30, 15%, 30%)' }} />
          <div className="flex justify-center gap-6 mb-4 text-xs" style={{ color: 'hsl(30, 10%, 55%)' }}>
            <span id="vercount_container_site_pv" style={{ display: 'none' }}>
              总访问量 <span id="vercount_value_site_pv"></span> 次
            </span>
            <span id="vercount_container_site_uv" style={{ display: 'none' }}>
              总访客 <span id="vercount_value_site_uv"></span> 人
            </span>
          </div>
          <p className="text-xs" style={{ color: 'hsl(30, 10%, 45%)' }}>
            © 2026 白沙河谷生态博物馆 · 白沙河谷本土文化园
          </p>
        </div>
      </footer>
    </div>
  );
}
