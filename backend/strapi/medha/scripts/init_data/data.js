const PLUGIN_NAME = "crm-plugin";

const ACADEMIC_YEARS = [
  { name: "AY 13-14", start_date: "2013-06-01", end_date: "2014-05-31" },
  { name: "AY 14-15", start_date: "2014-06-01", end_date: "2015-05-31" },
  { name: "AY 15-16", start_date: "2015-06-01", end_date: "2016-05-31" },
  { name: "AY 16-17", start_date: "2016-06-01", end_date: "2017-05-31" },
  { name: "AY 17-18", start_date: "2017-06-01", end_date: "2018-05-31" },
  { name: "AY 18-19", start_date: "2018-06-01", end_date: "2019-05-31" },
  { name: "AY 19-20", start_date: "2019-06-01", end_date: "2020-05-31" },
  { name: "AY 20-21", start_date: "2020-06-01", end_date: "2021-05-31" },
  { name: "AY 21-22", start_date: "2021-06-01", end_date: "2022-05-31" },
  { name: "AY 22-23", start_date: "2022-06-01", end_date: "2023-05-31" },
  { name: "AY 23-24", start_date: "2023-06-01", end_date: "2024-05-31" },
  { name: "AY 24-25", start_date: "2024-06-01", end_date: "2025-05-31" }
];

const FUTURE_ASPIRATIONS = [
  "Private Jobs",
  "Higher Studies",
  "Marriage",
  "Entrepreneurship",
  "Government Job",
  "Apprenticeship",
  "Others"
];

const COUNTRIES = [
  {
    name: "India",
    abbreviation: "IN",
    identifier: "IN",
    isActive: true,
    states: [
      {
        name: "Uttar Pradesh",
        abbreviation: "UP",
        identifier: "",
        isActive: true,
        zones: [
          { name: "West Zone - Daurala (Meerut)" },
          { name: "Bundelkhand Zone - Jhansi" },
          { name: "Central Zone - Lucknow" },
          { name: "East Zone - Varanasi" }
        ],
        districts: [
          { name: "Agra", abbreviation: "AG", identfier: "", is_active: true },
          {
            name: "Aligarh",
            abbreviation: "AL",
            identfier: "",
            is_active: true
          },
          {
            name: "Prayagraj",
            abbreviation: "PY",
            identfier: "",
            is_active: true
          },
          {
            name: "Ambedkar Nagar",
            abbreviation: "AN",
            identfier: "",
            is_active: true
          },
          {
            name: "Amroha",
            abbreviation: "JP",
            identfier: "",
            is_active: true
          },
          {
            name: "Auraiya",
            abbreviation: "AU",
            identfier: "",
            is_active: true
          },
          {
            name: "Azamgarh",
            abbreviation: "AZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Budaun",
            abbreviation: "BD",
            identfier: "",
            is_active: true
          },
          {
            name: "Baharaich",
            abbreviation: "BH",
            identfier: "",
            is_active: true
          },
          {
            name: "Ballia",
            abbreviation: "BL",
            identfier: "",
            is_active: true
          },
          {
            name: "Balrampur",
            abbreviation: "BP",
            identfier: "",
            is_active: true
          },
          { name: "Banda", abbreviation: "BN", identfier: "", is_active: true },
          {
            name: "Barabanki",
            abbreviation: "BB",
            identfier: "",
            is_active: true
          },
          {
            name: "Bareilly",
            abbreviation: "BR",
            identfier: "",
            is_active: true
          },
          { name: "Basti", abbreviation: "BS", identfier: "", is_active: true },
          {
            name: "Bijnore",
            abbreviation: "BI",
            identfier: "",
            is_active: true
          },
          {
            name: "Bulandshahr",
            abbreviation: "BU",
            identfier: "",
            is_active: true
          },
          {
            name: "Chandauli",
            abbreviation: "CD",
            identfier: "",
            is_active: true
          },
          {
            name: "Chitrakoot",
            abbreviation: "CT",
            identfier: "",
            is_active: true
          },
          {
            name: "Deoria",
            abbreviation: "DE",
            identfier: "",
            is_active: true
          },
          { name: "Etah", abbreviation: "ET", identfier: "", is_active: true },
          {
            name: "Etawah",
            abbreviation: "EW",
            identfier: "",
            is_active: true
          },
          {
            name: "Faizabad",
            abbreviation: "FZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Farrukhabad",
            abbreviation: "FR",
            identfier: "",
            is_active: true
          },
          {
            name: "Fatehpur",
            abbreviation: "FT",
            identfier: "",
            is_active: true
          },
          {
            name: "Firozabad",
            abbreviation: "FI",
            identfier: "",
            is_active: true
          },
          {
            name: "Gautam Buddha Nagar",
            abbreviation: "GB",
            identfier: "",
            is_active: true
          },
          {
            name: "Ghaziabad",
            abbreviation: "GZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Ghazipur",
            abbreviation: "GP",
            identfier: "",
            is_active: true
          },
          { name: "Gonda", abbreviation: "GN", identfier: "", is_active: true },
          {
            name: "Gorakhpur",
            abbreviation: "GR",
            identfier: "",
            is_active: true
          },
          {
            name: "Hamirpur",
            abbreviation: "HM",
            identfier: "",
            is_active: true
          },
          { name: "Hapur", abbreviation: "HA", identfier: "", is_active: true },
          {
            name: "Hardoi",
            abbreviation: "HR",
            identfier: "",
            is_active: true
          },
          {
            name: "Hathras",
            abbreviation: "HT",
            identfier: "",
            is_active: true
          },
          {
            name: "Jaunpur",
            abbreviation: "JU",
            identfier: "",
            is_active: true
          },
          {
            name: "Jhansi",
            abbreviation: "JH",
            identfier: "",
            is_active: true
          },
          {
            name: "Kannauj",
            abbreviation: "KJ",
            identfier: "",
            is_active: true
          },
          {
            name: "Kanpur Dehat",
            abbreviation: "KD",
            identfier: "",
            is_active: true
          },
          {
            name: "Kanpur Nagar",
            abbreviation: "KN",
            identfier: "",
            is_active: true
          },
          {
            name: "Ksganj",
            abbreviation: "KG",
            identfier: "",
            is_active: true
          },
          {
            name: "Kaushambi",
            abbreviation: "KS",
            identfier: "",
            is_active: true
          },
          {
            name: "Kushinagar",
            abbreviation: "KU",
            identfier: "",
            is_active: true
          },
          {
            name: "Lakhimpur Kheri",
            abbreviation: "LK",
            identfier: "",
            is_active: true
          },
          {
            name: "Lalitpur",
            abbreviation: "LA",
            identfier: "",
            is_active: true
          },
          {
            name: "Lucknow",
            abbreviation: "LU",
            identfier: "",
            is_active: true
          },
          {
            name: "Maharajganj",
            abbreviation: "MG",
            identfier: "",
            is_active: true
          },
          {
            name: "Mahoba",
            abbreviation: "MH",
            identfier: "",
            is_active: true
          },
          {
            name: "Mainpuri",
            abbreviation: "MP",
            identfier: "",
            is_active: true
          },
          {
            name: "Mathura",
            abbreviation: "MT",
            identfier: "",
            is_active: true
          },
          { name: "Mau", abbreviation: "MB", identfier: "", is_active: true },
          {
            name: "Meerut",
            abbreviation: "ME",
            identfier: "",
            is_active: true
          },
          {
            name: "Mirzapur",
            abbreviation: "MI",
            identfier: "",
            is_active: true
          },
          {
            name: "Moradabad",
            abbreviation: "MO",
            identfier: "",
            is_active: true
          },
          {
            name: "Muzaffarnagar",
            abbreviation: "MU",
            identfier: "",
            is_active: true
          },
          {
            name: "Pilibhit",
            abbreviation: "PI",
            identfier: "",
            is_active: true
          },
          {
            name: "Pratapgarh",
            abbreviation: "PR",
            identfier: "",
            is_active: true
          },
          {
            name: "Rae Bareily",
            abbreviation: "RB",
            identfier: "",
            is_active: true
          },
          {
            name: "Rampur",
            abbreviation: "RA",
            identfier: "",
            is_active: true
          },
          {
            name: "Saharanpur",
            abbreviation: "SA",
            identfier: "",
            is_active: true
          },
          {
            name: "Sant Kabir Nagar",
            abbreviation: "SK",
            identfier: "",
            is_active: true
          },
          {
            name: "Sant Ravidas Nagar",
            abbreviation: "SR",
            identfier: "",
            is_active: true
          },
          {
            name: "Sambhal",
            abbreviation: "SM",
            identfier: "",
            is_active: true
          },
          {
            name: "Shahjahanpur",
            abbreviation: "SJ",
            identfier: "",
            is_active: true
          },
          {
            name: "Shamli",
            abbreviation: "SH",
            identfier: "",
            is_active: true
          },
          {
            name: "Shravasti",
            abbreviation: "SV",
            identfier: "",
            is_active: true
          },
          {
            name: "Siddhartnagar",
            abbreviation: "SN",
            identfier: "",
            is_active: true
          },
          {
            name: "Sitapur",
            abbreviation: "SI",
            identfier: "",
            is_active: true
          },
          {
            name: "Sonbhadra",
            abbreviation: "SO",
            identfier: "",
            is_active: true
          },
          {
            name: "Sultanpur",
            abbreviation: "SU",
            identfier: "",
            is_active: true
          },
          { name: "Unnao", abbreviation: "UN", identfier: "", is_active: true },
          {
            name: "Varanasi",
            abbreviation: "VA",
            identfier: "",
            is_active: true
          },
          {
            name: "Amethi",
            abbreviation: "AM",
            identfier: "",
            is_active: true
          },
          {
            name: "Baghpat",
            abbreviation: "BT",
            identfier: "",
            is_active: true
          },
          {
            name: "Allahabad",
            abbreviation: "AH",
            identfier: "",
            is_active: true
          }
        ],
        rpcs: [
          { name: "Agra" },
          { name: "Bareilly" },
          { name: "Ghaziabad" },
          { name: "Gorakhpur" },
          { name: "Jhansi" },
          { name: "Kanpur" },
          { name: "Lucknow" },
          { name: "Moradabad" },
          { name: "Prayagraj" },
          { name: "Varanasi" }
        ]
      },
      {
        capital: "Mayabunder",
        abbreviation: "AN",
        identifier: "AN",
        isActive: true,
        name: "Andaman and Nicobar Islands",
        districts: [
          {
            id: "1",
            name: "Nicobar"
          },
          {
            id: "2",
            name: "North and Middle Andaman"
          },
          {
            id: "3",
            name: "South Andaman"
          }
        ]
      },
      {
        capital: "Amaravati",
        abbreviation: "AP",
        identifier: "AP",
        isActive: true,
        name: "Andhra Pradesh",
        districts: [
          {
            id: "1",
            name: "Anantapur"
          },
          {
            id: "2",
            name: "Chittoor"
          },
          {
            id: "3",
            name: "East Godavari"
          },
          {
            id: "4",
            name: "Guntur"
          },
          {
            id: "5",
            name: "Krishna"
          },
          {
            id: "6",
            name: "Kurnool"
          },
          {
            id: "7",
            name: "Nellore"
          },
          {
            id: "8",
            name: "Prakasam"
          },
          {
            id: "9",
            name: "Srikakulam"
          },
          {
            id: "10",
            name: "Visakhapatnam"
          },
          {
            id: "11",
            name: "Vizianagaram"
          },
          {
            id: "12",
            name: "West Godavari"
          },
          {
            id: "13",
            name: "YSR Kadapa"
          }
        ]
      },
      {
        capital: "Itanagar",
        abbreviation: "AR",
        identifier: "AR",
        isActive: true,
        name: "Arunachal Pradesh",
        districts: [
          {
            id: "1",
            name: "Tawang"
          },
          {
            id: "2",
            name: "West Kameng"
          },
          {
            id: "3",
            name: "East Kameng"
          },
          {
            id: "4",
            name: "Papum Pare"
          },
          {
            id: "5",
            name: "Kurung Kumey"
          },
          {
            id: "6",
            name: "Kra Daadi"
          },
          {
            id: "7",
            name: "Lower Subansiri"
          },
          {
            id: "8",
            name: "Upper Subansiri"
          },
          {
            id: "9",
            name: "West Siang"
          },
          {
            id: "10",
            name: "East Siang"
          },
          {
            id: "11",
            name: "Siang"
          },
          {
            id: "12",
            name: "Upper Siang"
          },
          {
            id: "13",
            name: "Lower Siang"
          },
          {
            id: "14",
            name: "Lower Dibang Valley"
          },
          {
            id: "15",
            name: "Dibang Valley"
          },
          {
            id: "16",
            name: "Anjaw"
          },
          {
            id: "17",
            name: "Lohit"
          },
          {
            id: "18",
            name: "Namsai"
          },
          {
            id: "19",
            name: "Changlang"
          },
          {
            id: "20",
            name: "Tirap"
          },
          {
            id: "21",
            name: "Longding"
          }
        ]
      },
      {
        capital: "Dispur",
        abbreviation: "AS",
        identifier: "AS",
        isActive: true,
        name: "Assam",
        districts: [
          {
            id: "1",
            name: "Baksa"
          },
          {
            id: "2",
            name: "Barpeta"
          },
          {
            id: "3",
            name: "Biswanath"
          },
          {
            id: "4",
            name: "Bongaigaon"
          },
          {
            id: "5",
            name: "Cachar"
          },
          {
            id: "6",
            name: "Charaideo"
          },
          {
            id: "7",
            name: "Chirang"
          },
          {
            id: "8",
            name: "Darrang"
          },
          {
            id: "9",
            name: "Dhemaji"
          },
          {
            id: "10",
            name: "Dhubri"
          },
          {
            id: "11",
            name: "Dibrugarh"
          },
          {
            id: "12",
            name: "Goalpara"
          },
          {
            id: "13",
            name: "Golaghat"
          },
          {
            id: "14",
            name: "Hailakandi"
          },
          {
            id: "15",
            name: "Hojai"
          },
          {
            id: "16",
            name: "Jorhat"
          },
          {
            id: "17",
            name: "Kamrup Metropolitan"
          },
          {
            id: "18",
            name: "Kamrup"
          },
          {
            id: "19",
            name: "Karbi Anglong"
          },
          {
            id: "20",
            name: "Karimganj"
          },
          {
            id: "21",
            name: "Kokrajhar"
          },
          {
            id: "22",
            name: "Lakhimpur"
          },
          {
            id: "23",
            name: "Majuli"
          },
          {
            id: "24",
            name: "Morigaon"
          },
          {
            id: "25",
            name: "Nagaon"
          },
          {
            id: "26",
            name: "Nalbari"
          },
          {
            id: "27",
            name: "Dima Hasao"
          },
          {
            id: "28",
            name: "Sivasagar"
          },
          {
            id: "29",
            name: "Sonitpur"
          },
          {
            id: "30",
            name: "South Salmara-Mankachar"
          },
          {
            id: "31",
            name: "Tinsukia"
          },
          {
            id: "32",
            name: "Udalguri"
          },
          {
            id: "33",
            name: "West Karbi Anglong"
          }
        ]
      },
      {
        capital: "Patna",
        abbreviation: "BR",
        identifier: "BR",
        isActive: true,
        name: "Bihar",
        districts: [
          {
            id: "1",
            name: "Araria"
          },
          {
            id: "2",
            name: "Arwal"
          },
          {
            id: "3",
            name: "Aurangabad"
          },
          {
            id: "4",
            name: "Banka"
          },
          {
            id: "5",
            name: "Begusarai"
          },
          {
            id: "6",
            name: "Bhagalpur"
          },
          {
            id: "7",
            name: "Bhojpur"
          },
          {
            id: "8",
            name: "Buxar"
          },
          {
            id: "9",
            name: "Darbhanga"
          },
          {
            id: "10",
            name: "East Champaran (Motihari)"
          },
          {
            id: "11",
            name: "Gaya"
          },
          {
            id: "12",
            name: "Gopalganj"
          },
          {
            id: "13",
            name: "Jamui"
          },
          {
            id: "14",
            name: "Jehanabad"
          },
          {
            id: "15",
            name: "Kaimur (Bhabua)"
          },
          {
            id: "16",
            name: "Katihar"
          },
          {
            id: "17",
            name: "Khagaria"
          },
          {
            id: "18",
            name: "Kishanganj"
          },
          {
            id: "19",
            name: "Lakhisarai"
          },
          {
            id: "20",
            name: "Madhepura"
          },
          {
            id: "21",
            name: "Madhubani"
          },
          {
            id: "22",
            name: "Munger (Monghyr)"
          },
          {
            id: "23",
            name: "Muzaffarpur"
          },
          {
            id: "24",
            name: "Nalanda"
          },
          {
            id: "25",
            name: "Nawada"
          },
          {
            id: "26",
            name: "Patna"
          },
          {
            id: "27",
            name: "Purnia (Purnea)"
          },
          {
            id: "28",
            name: "Rohtas"
          },
          {
            id: "29",
            name: "Saharsa"
          },
          {
            id: "30",
            name: "Samastipur"
          },
          {
            id: "31",
            name: "Saran"
          },
          {
            id: "32",
            name: "Sheikhpura"
          },
          {
            id: "33",
            name: "Sheohar"
          },
          {
            id: "34",
            name: "Sitamarhi"
          },
          {
            id: "35",
            name: "Siwan"
          },
          {
            id: "36",
            name: "Supaul"
          },
          {
            id: "37",
            name: "Vaishali"
          },
          {
            id: "38",
            name: "West Champaran"
          }
        ]
      },
      {
        capital: "Chandigarh",
        abbreviation: "CG",
        identifier: "CG",
        isActive: true,
        name: "Chandigarh",
        districts: [
          {
            id: "1",
            name: "Chandigarh"
          }
        ]
      },
      {
        capital: "Bilaspur (Judiciary), Raipur",
        abbreviation: "CH",
        identifier: "CH",
        isActive: true,
        name: "Chhattisgarh",
        districts: [
          {
            id: "1",
            name: "Balod"
          },
          {
            id: "2",
            name: "Baloda Bazar"
          },
          {
            id: "3",
            name: "Balrampur"
          },
          {
            id: "4",
            name: "Bastar"
          },
          {
            id: "5",
            name: "Bemetara"
          },
          {
            id: "6",
            name: "Bijapur"
          },
          {
            id: "7",
            name: "Bilaspur"
          },
          {
            id: "8",
            name: "Dantewada (South Bastar)"
          },
          {
            id: "9",
            name: "Dhamtari"
          },
          {
            id: "10",
            name: "Durg"
          },
          {
            id: "11",
            name: "Gariyaband"
          },
          {
            id: "12",
            name: "Janjgir-Champa"
          },
          {
            id: "13",
            name: "Jashpur"
          },
          {
            id: "14",
            name: "Kabirdham (Kawardha)"
          },
          {
            id: "15",
            name: "Kanker (North Bastar)"
          },
          {
            id: "16",
            name: "Kondagaon"
          },
          {
            id: "17",
            name: "Korba"
          },
          {
            id: "18",
            name: "Korea (Koriya)"
          },
          {
            id: "19",
            name: "Mahasamund"
          },
          {
            id: "20",
            name: "Mungeli"
          },
          {
            id: "21",
            name: "Narayanpur"
          },
          {
            id: "22",
            name: "Raigarh"
          },
          {
            id: "23",
            name: "Raipur"
          },
          {
            id: "24",
            name: "Rajnandgaon"
          },
          {
            id: "25",
            name: "Sukma"
          },
          {
            id: "26",
            name: "Surajpur  "
          },
          {
            id: "27",
            name: "Surguja"
          }
        ]
      },
      {
        capital: "Silvassa",
        abbreviation: "DH",
        identifier: "DH",
        isActive: true,
        name: "Dadra and Nagar Haveli",
        districts: [
          {
            id: "1",
            name: "Dadra & Nagar Haveli"
          }
        ]
      },
      {
        capital: "Daman",
        abbreviation: "DD",
        identifier: "DD",
        isActive: true,
        name: "Daman and Diu",
        districts: [
          {
            id: "1",
            name: "Daman"
          },
          {
            id: "2",
            name: "Diu"
          }
        ]
      },
      {
        capital: "New Delhi",
        abbreviation: "DL",
        identifier: "DL",
        isActive: true,
        name: "Delhi",
        districts: [
          {
            id: "1",
            name: "Central Delhi"
          },
          {
            id: "2",
            name: "East Delhi"
          },
          {
            id: "3",
            name: "New Delhi"
          },
          {
            id: "4",
            name: "North Delhi"
          },
          {
            id: "5",
            name: "North East  Delhi"
          },
          {
            id: "6",
            name: "North West  Delhi"
          },
          {
            id: "7",
            name: "Shahdara"
          },
          {
            id: "8",
            name: "South Delhi"
          },
          {
            id: "9",
            name: "South East Delhi"
          },
          {
            id: "10",
            name: "South West  Delhi"
          },
          {
            id: "11",
            name: "West Delhi"
          }
        ]
      },
      {
        capital: "Panaji",
        abbreviation: "GA",
        identifier: "GA",
        isActive: true,
        name: "Goa",
        districts: [
          {
            id: "1",
            name: "North Goa"
          },
          {
            id: "2",
            name: "South Goa"
          }
        ]
      },
      {
        capital: "Gandhinagar",
        abbreviation: "GJ",
        identifier: "GJ",
        isActive: true,
        name: "Gujarat",
        districts: [
          {
            id: "1",
            name: "Ahmedabad"
          },
          {
            id: "2",
            name: "Amreli"
          },
          {
            id: "3",
            name: "Anand"
          },
          {
            id: "4",
            name: "Aravalli"
          },
          {
            id: "5",
            name: "Banaskantha (Palanpur)"
          },
          {
            id: "6",
            name: "Bharuch"
          },
          {
            id: "7",
            name: "Bhavnagar"
          },
          {
            id: "8",
            name: "Botad"
          },
          {
            id: "9",
            name: "Chhota Udepur"
          },
          {
            id: "10",
            name: "Dahod"
          },
          {
            id: "11",
            name: "Dangs (Ahwa)"
          },
          {
            id: "12",
            name: "Devbhoomi Dwarka"
          },
          {
            id: "13",
            name: "Gandhinagar"
          },
          {
            id: "14",
            name: "Gir Somnath"
          },
          {
            id: "15",
            name: "Jamnagar"
          },
          {
            id: "16",
            name: "Junagadh"
          },
          {
            id: "17",
            name: "Kachchh"
          },
          {
            id: "18",
            name: "Kheda (Nadiad)"
          },
          {
            id: "19",
            name: "Mahisagar"
          },
          {
            id: "20",
            name: "Mehsana"
          },
          {
            id: "21",
            name: "Morbi"
          },
          {
            id: "22",
            name: "Narmada (Rajpipla)"
          },
          {
            id: "23",
            name: "Navsari"
          },
          {
            id: "24",
            name: "Panchmahal (Godhra)"
          },
          {
            id: "25",
            name: "Patan"
          },
          {
            id: "26",
            name: "Porbandar"
          },
          {
            id: "27",
            name: "Rajkot"
          },
          {
            id: "28",
            name: "Sabarkantha (Himmatnagar)"
          },
          {
            id: "29",
            name: "Surat"
          },
          {
            id: "30",
            name: "Surendranagar"
          },
          {
            id: "31",
            name: "Tapi (Vyara)"
          },
          {
            id: "32",
            name: "Vadodara"
          },
          {
            id: "33",
            name: "Valsad"
          }
        ]
      },
      {
        capital: "Chandigarh",
        abbreviation: "HR",
        identifier: "HR",
        isActive: true,
        name: "Haryana",
        districts: [
          {
            id: "1",
            name: "Ambala"
          },
          {
            id: "2",
            name: "Bhiwani"
          },
          {
            id: "3",
            name: "Charkhi Dadri"
          },
          {
            id: "4",
            name: "Faridabad"
          },
          {
            id: "5",
            name: "Fatehabad"
          },
          {
            id: "6",
            name: "Gurgaon"
          },
          {
            id: "7",
            name: "Hisar"
          },
          {
            id: "8",
            name: "Jhajjar"
          },
          {
            id: "9",
            name: "Jind"
          },
          {
            id: "10",
            name: "Kaithal"
          },
          {
            id: "11",
            name: "Karnal"
          },
          {
            id: "12",
            name: "Kurukshetra"
          },
          {
            id: "13",
            name: "Mahendragarh"
          },
          {
            id: "14",
            name: "Mewat"
          },
          {
            id: "15",
            name: "Palwal"
          },
          {
            id: "16",
            name: "Panchkula"
          },
          {
            id: "17",
            name: "Panipat"
          },
          {
            id: "18",
            name: "Rewari"
          },
          {
            id: "19",
            name: "Rohtak"
          },
          {
            id: "20",
            name: "Sirsa"
          },
          {
            id: "21",
            name: "Sonipat"
          },
          {
            id: "22",
            name: "Yamunanagar"
          }
        ]
      },
      {
        capital: "Shimla",
        abbreviation: "HP",
        identifier: "HP",
        isActive: true,
        name: "Himachal Pradesh",
        districts: [
          {
            id: "1",
            name: "Bilaspur"
          },
          {
            id: "2",
            name: "Chamba"
          },
          {
            id: "3",
            name: "Hamirpur"
          },
          {
            id: "4",
            name: "Kangra"
          },
          {
            id: "5",
            name: "Kinnaur"
          },
          {
            id: "6",
            name: "Kullu"
          },
          {
            id: "7",
            name: "Lahaul &amp; Spiti"
          },
          {
            id: "8",
            name: "Mandi"
          },
          {
            id: "9",
            name: "Shimla"
          },
          {
            id: "10",
            name: "Sirmaur (Sirmour)"
          },
          {
            id: "11",
            name: "Solan"
          },
          {
            id: "12",
            name: "Una"
          }
        ]
      },
      {
        capital: "Jammu (Winter), Srinagar (Summer)",
        abbreviation: "JK",
        identifier: "JK",
        isActive: true,
        name: "Jammu and Kashmir",
        districts: [
          {
            id: "1",
            name: "Anantnag"
          },
          {
            id: "2",
            name: "Bandipore"
          },
          {
            id: "3",
            name: "Baramulla"
          },
          {
            id: "4",
            name: "Budgam"
          },
          {
            id: "5",
            name: "Doda"
          },
          {
            id: "6",
            name: "Ganderbal"
          },
          {
            id: "7",
            name: "Jammu"
          },
          {
            id: "8",
            name: "Kargil"
          },
          {
            id: "9",
            name: "Kathua"
          },
          {
            id: "10",
            name: "Kishtwar"
          },
          {
            id: "11",
            name: "Kulgam"
          },
          {
            id: "12",
            name: "Kupwara"
          },
          {
            id: "13",
            name: "Leh"
          },
          {
            id: "14",
            name: "Poonch"
          },
          {
            id: "15",
            name: "Pulwama"
          },
          {
            id: "16",
            name: "Rajouri"
          },
          {
            id: "17",
            name: "Ramban"
          },
          {
            id: "18",
            name: "Reasi"
          },
          {
            id: "19",
            name: "Samba"
          },
          {
            id: "20",
            name: "Shopian"
          },
          {
            id: "21",
            name: "Srinagar"
          },
          {
            id: "22",
            name: "Udhampur"
          }
        ]
      },
      {
        capital: "Ranchi",
        abbreviation: "JH",
        identifier: "JH",
        isActive: true,
        name: "Jharkhand",
        districts: [
          {
            id: "1",
            name: "Bokaro"
          },
          {
            id: "2",
            name: "Chatra"
          },
          {
            id: "3",
            name: "Deoghar"
          },
          {
            id: "4",
            name: "Dhanbad"
          },
          {
            id: "5",
            name: "Dumka"
          },
          {
            id: "6",
            name: "East Singhbhum"
          },
          {
            id: "7",
            name: "Garhwa"
          },
          {
            id: "8",
            name: "Giridih"
          },
          {
            id: "9",
            name: "Godda"
          },
          {
            id: "10",
            name: "Gumla"
          },
          {
            id: "11",
            name: "Hazaribag"
          },
          {
            id: "12",
            name: "Jamtara"
          },
          {
            id: "13",
            name: "Khunti"
          },
          {
            id: "14",
            name: "Koderma"
          },
          {
            id: "15",
            name: "Latehar"
          },
          {
            id: "16",
            name: "Lohardaga"
          },
          {
            id: "17",
            name: "Pakur"
          },
          {
            id: "18",
            name: "Palamu"
          },
          {
            id: "19",
            name: "Ramgarh"
          },
          {
            id: "20",
            name: "Ranchi"
          },
          {
            id: "21",
            name: "Sahibganj"
          },
          {
            id: "22",
            name: "Seraikela-Kharsawan"
          },
          {
            id: "23",
            name: "Simdega"
          },
          {
            id: "24",
            name: "West Singhbhum"
          }
        ]
      },
      {
        capital: "Bengaluru",
        abbreviation: "KA",
        identifier: "KA",
        isActive: true,
        name: "Karnataka",
        districts: [
          {
            id: "1",
            name: "Bagalkot"
          },
          {
            id: "2",
            name: "Ballari (Bellary)"
          },
          {
            id: "3",
            name: "Belagavi (Belgaum)"
          },
          {
            id: "4",
            name: "Bengaluru (Bangalore) Rural"
          },
          {
            id: "5",
            name: "Bengaluru (Bangalore) Urban"
          },
          {
            id: "6",
            name: "Bidar"
          },
          {
            id: "7",
            name: "Chamarajanagar"
          },
          {
            id: "8",
            name: "Chikballapur"
          },
          {
            id: "9",
            name: "Chikkamagaluru (Chikmagalur)"
          },
          {
            id: "10",
            name: "Chitradurga"
          },
          {
            id: "11",
            name: "Dakshina Kannada"
          },
          {
            id: "12",
            name: "Davangere"
          },
          {
            id: "13",
            name: "Dharwad"
          },
          {
            id: "14",
            name: "Gadag"
          },
          {
            id: "15",
            name: "Hassan"
          },
          {
            id: "16",
            name: "Haveri"
          },
          {
            id: "17",
            name: "Kalaburagi (Gulbarga)"
          },
          {
            id: "18",
            name: "Kodagu"
          },
          {
            id: "19",
            name: "Kolar"
          },
          {
            id: "20",
            name: "Koppal"
          },
          {
            id: "21",
            name: "Mandya"
          },
          {
            id: "22",
            name: "Mysuru (Mysore)"
          },
          {
            id: "23",
            name: "Raichur"
          },
          {
            id: "24",
            name: "Ramanagara"
          },
          {
            id: "25",
            name: "Shivamogga (Shimoga)"
          },
          {
            id: "26",
            name: "Tumakuru (Tumkur)"
          },
          {
            id: "27",
            name: "Udupi"
          },
          {
            id: "28",
            name: "Uttara Kannada (Karwar)"
          },
          {
            id: "29",
            name: "Vijayapura (Bijapur)"
          },
          {
            id: "30",
            name: "Yadgir"
          }
        ]
      },
      {
        capital: "Thiruvananthapuram",
        abbreviation: "KL",
        identifier: "KL",
        isActive: true,
        name: "Kerala",
        districts: [
          {
            id: "1",
            name: "Alappuzha"
          },
          {
            id: "2",
            name: "Ernakulam"
          },
          {
            id: "3",
            name: "Idukki"
          },
          {
            id: "4",
            name: "Kannur"
          },
          {
            id: "5",
            name: "Kasaragod"
          },
          {
            id: "6",
            name: "Kollam"
          },
          {
            id: "7",
            name: "Kottayam"
          },
          {
            id: "8",
            name: "Kozhikode"
          },
          {
            id: "9",
            name: "Malappuram"
          },
          {
            id: "10",
            name: "Palakkad"
          },
          {
            id: "11",
            name: "Pathanamthitta"
          },
          {
            id: "12",
            name: "Thiruvananthapuram"
          },
          {
            id: "13",
            name: "Thrissur"
          },
          {
            id: "14",
            name: "Wayanad"
          }
        ]
      },
      {
        capital: "Leh, Kargil",
        abbreviation: "LA",
        identifier: "LA",
        isActive: true,
        name: "Ladakh",
        districts: [
          {
            id: "1",
            name: "Kargil"
          },
          {
            id: "2",
            name: "Leh"
          }
        ]
      },
      {
        capital: "Kavaratti",
        abbreviation: "LD",
        identifier: "LD",
        isActive: true,
        name: "Lakshadweep",
        districts: [
          {
            id: "1",
            name: "Agatti"
          },
          {
            id: "2",
            name: "Amini"
          },
          {
            id: "3",
            name: "Androth"
          },
          {
            id: "4",
            name: "Bithra"
          },
          {
            id: "5",
            name: "Chethlath"
          },
          {
            id: "6",
            name: "Kavaratti"
          },
          {
            id: "7",
            name: "Kadmath"
          },
          {
            id: "8",
            name: "Kalpeni"
          },
          {
            id: "9",
            name: "Kilthan"
          },
          {
            id: "10",
            name: "Minicoy"
          }
        ]
      },
      {
        capital: "Bhopal",
        abbreviation: "MP",
        identifier: "MP",
        isActive: true,
        name: "Madhya Pradesh",
        districts: [
          {
            id: "1",
            name: "Agar Malwa"
          },
          {
            id: "2",
            name: "Alirajpur"
          },
          {
            id: "3",
            name: "Anuppur"
          },
          {
            id: "4",
            name: "Ashoknagar"
          },
          {
            id: "5",
            name: "Balaghat"
          },
          {
            id: "6",
            name: "Barwani"
          },
          {
            id: "7",
            name: "Betul"
          },
          {
            id: "8",
            name: "Bhind"
          },
          {
            id: "9",
            name: "Bhopal"
          },
          {
            id: "10",
            name: "Burhanpur"
          },
          {
            id: "11",
            name: "Chhatarpur"
          },
          {
            id: "12",
            name: "Chhindwara"
          },
          {
            id: "13",
            name: "Damoh"
          },
          {
            id: "14",
            name: "Datia"
          },
          {
            id: "15",
            name: "Dewas"
          },
          {
            id: "16",
            name: "Dhar"
          },
          {
            id: "17",
            name: "Dindori"
          },
          {
            id: "18",
            name: "Guna"
          },
          {
            id: "19",
            name: "Gwalior"
          },
          {
            id: "20",
            name: "Harda"
          },
          {
            id: "21",
            name: "Hoshangabad"
          },
          {
            id: "22",
            name: "Indore"
          },
          {
            id: "23",
            name: "Jabalpur"
          },
          {
            id: "24",
            name: "Jhabua"
          },
          {
            id: "25",
            name: "Katni"
          },
          {
            id: "26",
            name: "Khandwa"
          },
          {
            id: "27",
            name: "Khargone"
          },
          {
            id: "28",
            name: "Mandla"
          },
          {
            id: "29",
            name: "Mandsaur"
          },
          {
            id: "30",
            name: "Morena"
          },
          {
            id: "31",
            name: "Narsinghpur"
          },
          {
            id: "32",
            name: "Neemuch"
          },
          {
            id: "33",
            name: "Panna"
          },
          {
            id: "34",
            name: "Raisen"
          },
          {
            id: "35",
            name: "Rajgarh"
          },
          {
            id: "36",
            name: "Ratlam"
          },
          {
            id: "37",
            name: "Rewa"
          },
          {
            id: "38",
            name: "Sagar"
          },
          {
            id: "39",
            name: "Satna"
          },
          {
            id: "40",
            name: "Sehore"
          },
          {
            id: "41",
            name: "Seoni"
          },
          {
            id: "42",
            name: "Shahdol"
          },
          {
            id: "43",
            name: "Shajapur"
          },
          {
            id: "44",
            name: "Sheopur"
          },
          {
            id: "45",
            name: "Shivpuri"
          },
          {
            id: "46",
            name: "Sidhi"
          },
          {
            id: "47",
            name: "Singrauli"
          },
          {
            id: "48",
            name: "Tikamgarh"
          },
          {
            id: "49",
            name: "Ujjain"
          },
          {
            id: "50",
            name: "Umaria"
          },
          {
            id: "51",
            name: "Vidisha"
          }
        ]
      },
      {
        capital: "Mumbai",
        abbreviation: "MH",
        identifier: "MH",
        isActive: true,
        name: "Maharashtra",
        districts: [
          {
            id: "1",
            name: "Ahmednagar"
          },
          {
            id: "2",
            name: "Akola"
          },
          {
            id: "3",
            name: "Amravati"
          },
          {
            id: "4",
            name: "Aurangabad"
          },
          {
            id: "5",
            name: "Beed"
          },
          {
            id: "6",
            name: "Bhandara"
          },
          {
            id: "7",
            name: "Buldhana"
          },
          {
            id: "8",
            name: "Chandrapur"
          },
          {
            id: "9",
            name: "Dhule"
          },
          {
            id: "10",
            name: "Gadchiroli"
          },
          {
            id: "11",
            name: "Gondia"
          },
          {
            id: "12",
            name: "Hingoli"
          },
          {
            id: "13",
            name: "Jalgaon"
          },
          {
            id: "14",
            name: "Jalna"
          },
          {
            id: "15",
            name: "Kolhapur"
          },
          {
            id: "16",
            name: "Latur"
          },
          {
            id: "17",
            name: "Mumbai City"
          },
          {
            id: "18",
            name: "Mumbai Suburban"
          },
          {
            id: "19",
            name: "Nagpur"
          },
          {
            id: "20",
            name: "Nanded"
          },
          {
            id: "21",
            name: "Nandurbar"
          },
          {
            id: "22",
            name: "Nashik"
          },
          {
            id: "23",
            name: "Osmanabad"
          },
          {
            id: "24",
            name: "Palghar"
          },
          {
            id: "25",
            name: "Parbhani"
          },
          {
            id: "26",
            name: "Pune"
          },
          {
            id: "27",
            name: "Raigad"
          },
          {
            id: "28",
            name: "Ratnagiri"
          },
          {
            id: "29",
            name: "Sangli"
          },
          {
            id: "30",
            name: "Satara"
          },
          {
            id: "31",
            name: "Sindhudurg"
          },
          {
            id: "32",
            name: "Solapur"
          },
          {
            id: "33",
            name: "Thane"
          },
          {
            id: "34",
            name: "Wardha"
          },
          {
            id: "35",
            name: "Washim"
          },
          {
            id: "36",
            name: "Yavatmal"
          }
        ]
      },
      {
        capital: "Imphal",
        abbreviation: "MN",
        identifier: "MN",
        isActive: true,
        name: "Manipur",
        districts: [
          {
            id: "1",
            name: "Bishnupur"
          },
          {
            id: "2",
            name: "Chandel"
          },
          {
            id: "3",
            name: "Churachandpur"
          },
          {
            id: "4",
            name: "Imphal East"
          },
          {
            id: "5",
            name: "Imphal West"
          },
          {
            id: "6",
            name: "Jiribam"
          },
          {
            id: "7",
            name: "Kakching"
          },
          {
            id: "8",
            name: "Kamjong"
          },
          {
            id: "9",
            name: "Kangpokpi"
          },
          {
            id: "10",
            name: "Noney"
          },
          {
            id: "11",
            name: "Pherzawl"
          },
          {
            id: "12",
            name: "Senapati"
          },
          {
            id: "13",
            name: "Tamenglong"
          },
          {
            id: "14",
            name: "Tengnoupal"
          },
          {
            id: "15",
            name: "Thoubal"
          },
          {
            id: "16",
            name: "Ukhrul"
          }
        ]
      },
      {
        capital: "Shillong",
        abbreviation: "ML",
        identifier: "ML",
        isActive: true,
        name: "Meghalaya",
        districts: [
          {
            id: "1",
            name: "East Garo Hills"
          },
          {
            id: "2",
            name: "East Jaintia Hills"
          },
          {
            id: "3",
            name: "East Khasi Hills"
          },
          {
            id: "4",
            name: "North Garo Hills"
          },
          {
            id: "5",
            name: "Ri Bhoi"
          },
          {
            id: "6",
            name: "South Garo Hills"
          },
          {
            id: "7",
            name: "South West Garo Hills "
          },
          {
            id: "8",
            name: "South West Khasi Hills"
          },
          {
            id: "9",
            name: "West Garo Hills"
          },
          {
            id: "10",
            name: "West Jaintia Hills"
          },
          {
            id: "11",
            name: "West Khasi Hills"
          }
        ]
      },
      {
        capital: "Aizawl",
        abbreviation: "MZ",
        identifier: "MZ",
        isActive: true,
        name: "Mizoram",
        districts: [
          {
            id: "1",
            name: "Aizawl"
          },
          {
            id: "2",
            name: "Champhai"
          },
          {
            id: "3",
            name: "Kolasib"
          },
          {
            id: "4",
            name: "Lawngtlai"
          },
          {
            id: "5",
            name: "Lunglei"
          },
          {
            id: "6",
            name: "Mamit"
          },
          {
            id: "7",
            name: "Saiha"
          },
          {
            id: "8",
            name: "Serchhip"
          }
        ]
      },
      {
        capital: "Kohima",
        abbreviation: "NL",
        identifier: "NL",
        isActive: true,
        name: "Nagaland",
        districts: [
          {
            id: "1",
            name: "Dimapur"
          },
          {
            id: "2",
            name: "Kiphire"
          },
          {
            id: "3",
            name: "Kohima"
          },
          {
            id: "4",
            name: "Longleng"
          },
          {
            id: "5",
            name: "Mokokchung"
          },
          {
            id: "6",
            name: "Mon"
          },
          {
            id: "7",
            name: "Peren"
          },
          {
            id: "8",
            name: "Phek"
          },
          {
            id: "9",
            name: "Tuensang"
          },
          {
            id: "10",
            name: "Wokha"
          },
          {
            id: "11",
            name: "Zunheboto"
          }
        ]
      },
      {
        capital: "Bhubaneswar",
        abbreviation: "OR",
        identifier: "OR",
        isActive: true,
        name: "Odisha",
        districts: [
          {
            id: "1",
            name: "Angul"
          },
          {
            id: "2",
            name: "Balangir"
          },
          {
            id: "3",
            name: "Balasore"
          },
          {
            id: "4",
            name: "Bargarh"
          },
          {
            id: "5",
            name: "Bhadrak"
          },
          {
            id: "6",
            name: "Boudh"
          },
          {
            id: "7",
            name: "Cuttack"
          },
          {
            id: "8",
            name: "Deogarh"
          },
          {
            id: "9",
            name: "Dhenkanal"
          },
          {
            id: "10",
            name: "Gajapati"
          },
          {
            id: "11",
            name: "Ganjam"
          },
          {
            id: "12",
            name: "Jagatsinghapur"
          },
          {
            id: "13",
            name: "Jajpur"
          },
          {
            id: "14",
            name: "Jharsuguda"
          },
          {
            id: "15",
            name: "Kalahandi"
          },
          {
            id: "16",
            name: "Kandhamal"
          },
          {
            id: "17",
            name: "Kendrapara"
          },
          {
            id: "18",
            name: "Kendujhar (Keonjhar)"
          },
          {
            id: "19",
            name: "Khordha"
          },
          {
            id: "20",
            name: "Koraput"
          },
          {
            id: "21",
            name: "Malkangiri"
          },
          {
            id: "22",
            name: "Mayurbhanj"
          },
          {
            id: "23",
            name: "Nabarangpur"
          },
          {
            id: "24",
            name: "Nayagarh"
          },
          {
            id: "25",
            name: "Nuapada"
          },
          {
            id: "26",
            name: "Puri"
          },
          {
            id: "27",
            name: "Rayagada"
          },
          {
            id: "28",
            name: "Sambalpur"
          },
          {
            id: "29",
            name: "Sonepur"
          },
          {
            id: "30",
            name: "Sundargarh"
          }
        ]
      },
      {
        capital: "Puducherry",
        abbreviation: "PY",
        identifier: "PY",
        isActive: true,
        name: "Puducherry",
        districts: [
          {
            id: "1",
            name: "Karaikal"
          },
          {
            id: "2",
            name: "Mahe"
          },
          {
            id: "3",
            name: "Pondicherry"
          },
          {
            id: "4",
            name: "Yanam"
          }
        ]
      },
      {
        capital: "Chandigarh",
        abbreviation: "PB",
        identifier: "PB",
        isActive: true,
        name: "Punjab",
        districts: [
          {
            id: "1",
            name: "Amritsar"
          },
          {
            id: "2",
            name: "Barnala"
          },
          {
            id: "3",
            name: "Bathinda"
          },
          {
            id: "4",
            name: "Faridkot"
          },
          {
            id: "5",
            name: "Fatehgarh Sahib"
          },
          {
            id: "6",
            name: "Fazilka"
          },
          {
            id: "7",
            name: "Ferozepur"
          },
          {
            id: "8",
            name: "Gurdaspur"
          },
          {
            id: "9",
            name: "Hoshiarpur"
          },
          {
            id: "10",
            name: "Jalandhar"
          },
          {
            id: "11",
            name: "Kapurthala"
          },
          {
            id: "12",
            name: "Ludhiana"
          },
          {
            id: "13",
            name: "Mansa"
          },
          {
            id: "14",
            name: "Moga"
          },
          {
            id: "15",
            name: "Muktsar"
          },
          {
            id: "16",
            name: "Nawanshahr (Shahid Bhagat Singh Nagar)"
          },
          {
            id: "17",
            name: "Pathankot"
          },
          {
            id: "18",
            name: "Patiala"
          },
          {
            id: "19",
            name: "Rupnagar"
          },
          {
            id: "20",
            name: "Sahibzada Ajit Singh Nagar (Mohali)"
          },
          {
            id: "21",
            name: "Sangrur"
          },
          {
            id: "22",
            name: "Tarn Taran"
          }
        ]
      },
      {
        capital: "Jaipur",
        abbreviation: "RJ",
        identifier: "RJ",
        isActive: true,
        name: "Rajasthan",
        districts: [
          {
            id: "1",
            name: "Ajmer"
          },
          {
            id: "2",
            name: "Alwar"
          },
          {
            id: "3",
            name: "Banswara"
          },
          {
            id: "4",
            name: "Baran"
          },
          {
            id: "5",
            name: "Barmer"
          },
          {
            id: "6",
            name: "Bharatpur"
          },
          {
            id: "7",
            name: "Bhilwara"
          },
          {
            id: "8",
            name: "Bikaner"
          },
          {
            id: "9",
            name: "Bundi"
          },
          {
            id: "10",
            name: "Chittorgarh"
          },
          {
            id: "11",
            name: "Churu"
          },
          {
            id: "12",
            name: "Dausa"
          },
          {
            id: "13",
            name: "Dholpur"
          },
          {
            id: "14",
            name: "Dungarpur"
          },
          {
            id: "15",
            name: "Hanumangarh"
          },
          {
            id: "16",
            name: "Jaipur"
          },
          {
            id: "17",
            name: "Jaisalmer"
          },
          {
            id: "18",
            name: "Jalore"
          },
          {
            id: "19",
            name: "Jhalawar"
          },
          {
            id: "20",
            name: "Jhunjhunu"
          },
          {
            id: "21",
            name: "Jodhpur"
          },
          {
            id: "22",
            name: "Karauli"
          },
          {
            id: "23",
            name: "Kota"
          },
          {
            id: "24",
            name: "Nagaur"
          },
          {
            id: "25",
            name: "Pali"
          },
          {
            id: "26",
            name: "Pratapgarh"
          },
          {
            id: "27",
            name: "Rajsamand"
          },
          {
            id: "28",
            name: "Sawai Madhopur"
          },
          {
            id: "29",
            name: "Sikar"
          },
          {
            id: "30",
            name: "Sirohi"
          },
          {
            id: "31",
            name: "Sri Ganganagar"
          },
          {
            id: "32",
            name: "Tonk"
          },
          {
            id: "33",
            name: "Udaipur"
          }
        ]
      },
      {
        capital: "Gangtok",
        abbreviation: "SK",
        identifier: "SK",
        isActive: true,
        name: "Sikkim",
        districts: [
          {
            id: "1",
            name: "East Sikkim"
          },
          {
            id: "2",
            name: "North Sikkim"
          },
          {
            id: "3",
            name: "South Sikkim"
          },
          {
            id: "4",
            name: "West Sikkim"
          }
        ]
      },
      {
        capital: "Chennai",
        abbreviation: "TN",
        identifier: "TN",
        isActive: true,
        name: "Tamil Nadu",
        districts: [
          {
            id: "1",
            name: "Ariyalur"
          },
          {
            id: "2",
            name: "Chennai"
          },
          {
            id: "3",
            name: "Coimbatore"
          },
          {
            id: "4",
            name: "Cuddalore"
          },
          {
            id: "5",
            name: "Dharmapuri"
          },
          {
            id: "6",
            name: "Dindigul"
          },
          {
            id: "7",
            name: "Erode"
          },
          {
            id: "8",
            name: "Kanchipuram"
          },
          {
            id: "9",
            name: "Kanyakumari"
          },
          {
            id: "10",
            name: "Karur"
          },
          {
            id: "11",
            name: "Krishnagiri"
          },
          {
            id: "12",
            name: "Madurai"
          },
          {
            id: "13",
            name: "Nagapattinam"
          },
          {
            id: "14",
            name: "Namakkal"
          },
          {
            id: "15",
            name: "Nilgiris"
          },
          {
            id: "16",
            name: "Perambalur"
          },
          {
            id: "17",
            name: "Pudukkottai"
          },
          {
            id: "18",
            name: "Ramanathapuram"
          },
          {
            id: "19",
            name: "Salem"
          },
          {
            id: "20",
            name: "Sivaganga"
          },
          {
            id: "21",
            name: "Thanjavur"
          },
          {
            id: "22",
            name: "Theni"
          },
          {
            id: "23",
            name: "Thoothukudi (Tuticorin)"
          },
          {
            id: "24",
            name: "Tiruchirappalli"
          },
          {
            id: "25",
            name: "Tirunelveli"
          },
          {
            id: "26",
            name: "Tiruppur"
          },
          {
            id: "27",
            name: "Tiruvallur"
          },
          {
            id: "28",
            name: "Tiruvannamalai"
          },
          {
            id: "29",
            name: "Tiruvarur"
          },
          {
            id: "30",
            name: "Vellore"
          },
          {
            id: "31",
            name: "Viluppuram"
          },
          {
            id: "32",
            name: "Virudhunagar"
          }
        ]
      },
      {
        capital: "Hyderabad",
        abbreviation: "TS",
        identifier: "TS",
        isActive: true,
        name: "Telangana",
        districts: [
          {
            id: "1",
            name: "Adilabad"
          },
          {
            id: "2",
            name: "Bhadradri Kothagudem"
          },
          {
            id: "3",
            name: "Hyderabad"
          },
          {
            id: "4",
            name: "Jagtial"
          },
          {
            id: "5",
            name: "Jangaon"
          },
          {
            id: "6",
            name: "Jayashankar Bhoopalpally"
          },
          {
            id: "7",
            name: "Jogulamba Gadwal"
          },
          {
            id: "8",
            name: "Kamareddy"
          },
          {
            id: "9",
            name: "Karimnagar"
          },
          {
            id: "10",
            name: "Khammam"
          },
          {
            id: "11",
            name: "Komaram Bheem Asifabad"
          },
          {
            id: "12",
            name: "Mahabubabad"
          },
          {
            id: "13",
            name: "Mahabubnagar"
          },
          {
            id: "14",
            name: "Mancherial"
          },
          {
            id: "15",
            name: "Medak"
          },
          {
            id: "16",
            name: "Medchal"
          },
          {
            id: "17",
            name: "Nagarkurnool"
          },
          {
            id: "18",
            name: "Nalgonda"
          },
          {
            id: "19",
            name: "Nirmal"
          },
          {
            id: "20",
            name: "Nizamabad"
          },
          {
            id: "21",
            name: "Peddapalli"
          },
          {
            id: "22",
            name: "Rajanna Sircilla"
          },
          {
            id: "23",
            name: "Rangareddy"
          },
          {
            id: "24",
            name: "Sangareddy"
          },
          {
            id: "25",
            name: "Siddipet"
          },
          {
            id: "26",
            name: "Suryapet"
          },
          {
            id: "27",
            name: "Vikarabad"
          },
          {
            id: "28",
            name: "Wanaparthy"
          },
          {
            id: "29",
            name: "Warangal (Rural)"
          },
          {
            id: "30",
            name: "Warangal (Urban)"
          },
          {
            id: "31",
            name: "Yadadri Bhuvanagiri"
          }
        ]
      },
      {
        capital: "Agartala",
        abbreviation: "TR",
        identifier: "TR",
        isActive: true,
        name: "Tripura",
        districts: [
          {
            id: "1",
            name: "Dhalai"
          },
          {
            id: "2",
            name: "Gomati"
          },
          {
            id: "3",
            name: "Khowai"
          },
          {
            id: "4",
            name: "North Tripura"
          },
          {
            id: "5",
            name: "Sepahijala"
          },
          {
            id: "6",
            name: "South Tripura"
          },
          {
            id: "7",
            name: "Unakoti"
          },
          {
            id: "8",
            name: "West Tripura"
          }
        ]
      },
      {
        capital: "Dehradun",
        abbreviation: "UK",
        identifier: "UK",
        isActive: true,
        name: "Uttarakhand",
        districts: [
          {
            id: "1",
            name: "Almora"
          },
          {
            id: "2",
            name: "Bageshwar"
          },
          {
            id: "3",
            name: "Chamoli"
          },
          {
            id: "4",
            name: "Champawat"
          },
          {
            id: "5",
            name: "Dehradun"
          },
          {
            id: "6",
            name: "Haridwar"
          },
          {
            id: "7",
            name: "Nainital"
          },
          {
            id: "8",
            name: "Pauri Garhwal"
          },
          {
            id: "9",
            name: "Pithoragarh"
          },
          {
            id: "10",
            name: "Rudraprayag"
          },
          {
            id: "11",
            name: "Tehri Garhwal"
          },
          {
            id: "12",
            name: "Udham Singh Nagar"
          },
          {
            id: "13",
            name: "Uttarkashi"
          }
        ]
      },
      {
        capital: "Kolkata",
        abbreviation: "WB",
        identifier: "WB",
        isActive: true,
        name: "West Bengal",
        districts: [
          {
            id: "1",
            name: "Alipurduar"
          },
          {
            id: "2",
            name: "Bankura"
          },
          {
            id: "3",
            name: "Birbhum"
          },
          {
            id: "4",
            name: "Burdwan (Bardhaman)"
          },
          {
            id: "5",
            name: "Cooch Behar"
          },
          {
            id: "6",
            name: "Dakshin Dinajpur (South Dinajpur)"
          },
          {
            id: "7",
            name: "Darjeeling"
          },
          {
            id: "8",
            name: "Hooghly"
          },
          {
            id: "9",
            name: "Howrah"
          },
          {
            id: "10",
            name: "Jalpaiguri"
          },
          {
            id: "11",
            name: "Kalimpong"
          },
          {
            id: "12",
            name: "Kolkata"
          },
          {
            id: "13",
            name: "Malda"
          },
          {
            id: "14",
            name: "Murshidabad"
          },
          {
            id: "15",
            name: "Nadia"
          },
          {
            id: "16",
            name: "North 24 Parganas"
          },
          {
            id: "17",
            name: "Paschim Medinipur (West Medinipur)"
          },
          {
            id: "18",
            name: "Purba Medinipur (East Medinipur)"
          },
          {
            id: "19",
            name: "Purulia"
          },
          {
            id: "20",
            name: "South 24 Parganas"
          },
          {
            id: "21",
            name: "Uttar Dinajpur (North Dinajpur)"
          }
        ]
      }
    ]
  }
];

const QUESTION_SET = [
  {
    name: "Activity Question Set",
    questions: [
      {
        question: "The objectives of the training were met?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "The presentation materials were relevant?",
        type: "Rating",
        role: "Student"
      },
      {
        question:
          "The trainers were well prepared and able to answer any questions?",
        type: "Rating",
        role: "Student"
      },
      {
        question:
          "The pace of the course was appropriate to the content and attendees?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "The venue was appropriate for the training?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "Student"
      },
      {
        question: "College Feedback?",
        type: "Rating",
        role: "College Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "College Admin"
      },
      {
        question: "RPC Feedback?",
        type: "Rating",
        role: "RPC Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "RPC Admin"
      },
      {
        question: "Zone Feedback?",
        type: "Rating",
        role: "Zonal Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "Zonal Admin"
      }
    ]
  },
  {
    name: "Event Question Set",
    questions: [
      {
        question: "How professional was the recruiter?",
        type: "Rating",
        role: "Student"
      },
      {
        question:
          "How clearly did the recruiter explain the details of the job to you?",
        type: "Rating",
        role: "Student"
      },
      {
        question:
          "There was adequate opportunity for interaction with other staff during the placement ?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "Faculty was friendly, helpful and knowledgeable ?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "The venue was appropriate for the event?",
        type: "Rating",
        role: "Student"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "Student"
      },
      {
        question: "College Feedback?",
        type: "Rating",
        role: "College Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "College Admin"
      },
      {
        question: "RPC Feedback?",
        type: "Rating",
        role: "RPC Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "RPC Admin"
      },
      {
        question: "Zone Feedback?",
        type: "Rating",
        role: "Zonal Admin"
      },
      {
        question: "Comments",
        type: "Comment",
        role: "Zonal Admin"
      }
    ]
  }
];
const STREAMS = [
  "Mechanical Engineering (Production)",
  "Computer Science And Engineering",
  "Electronics Engineering",
  "Information Technology",
  "Civil Engineering",
  "Electrical Engineering",
  "Modern Office Management And Secreterial Practice",
  "Diploma In Pharmacy",
  "Interior Design And Decoration",
  "P.G.Diploma In Computer Application",
  "Textile Design",
  "P G Diploma In Accountacy (With Computerised Account & Taxation)",
  "Architectural Assistantship",
  "Fashion Designing & Garment Technology",
  "Instrumentation And Control",
  "P G Diploma In Web Designing",
  "Mechanical Engineering (Automobile)",
  "Leather Technology (Tanning)",
  "Leather Technology Footwear (Computer Aided Shoe Design)",
  "Carpet Technology",
  "Textile Technology",
  "Chemical Engineering",
  "Mechanical Engineering",
  "Electrical Engineering (Industrial Control)",
  "Electronics Engineering (Modern Consumer Electronics Appliances)",
  "P.G.Diploma In Marketing And Sales Management",
  "Civil Engineering (Environment & Pollution Control)",
  "Mechanical Engineering (Maintenance)",
  "Paint Technology",
  "Chemical Technology (Fertilizer)",
  "Chemical Technology (Rubber And Plastic)",
  "Electrical And Electronics Engineering",
  "Textile Design (Printing)",
  "Printing Technology",
  "Food Technology",
  "Textile Chemistry",
  "Dairy Engineering",
  "Mechanical Engineering (Refrigeration & Airconditioning)",
  "P.G.Diploma In Bio Technology (Tissue Culture)",
  "Electronics Engineering (Micro Electronics)",
  "Glass And Ceramic Engineering",
  "Agriculture Engineering",
  "Mechanical Engineering (Computer Aided Design)",
  "P G Diploma In Computer Hardware & Networking",
  "P.G. Diploma In Mass Communication",
  "Diploma In Plastic Mould Technology",
  "P G Diploma In Retail Management",
  "Chemical Engineering (Petro Chemical)",
  "Library And Information Science",
  "Electronics Engineering (Advance Microprocessor & Interface)",
  "Textile Engineering",
  "Mining Engineering"
];

const ROLES = {
  Admin: {
    controllers: [
      {
        name: "academic-history",
        action: ["find", "findone"]
      },
      {
        name: "academic-year",
        action: ["find", "findone"]
      },
      {
        name: "activity-batch",
        action: ["find", "findone"]
      },
      {
        name: "education",
        action: ["find", "findone"]
      },
      {
        name: "event",
        action: ["find", "findone"]
      },
      {
        name: "event-registration",
        action: ["find", "findone"]
      },
      {
        name: "feedback",
        action: ["find", "findone"]
      },
      {
        name: "question",
        action: ["find", "findone"]
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["find", "findone"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "stream",
        action: ["find", "findone"]
      },
      {
        name: "user",
        action: ["find", "findone", "me"]
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "document",
        action: ["find", "findone"]
      },
      {
        name: "activity",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "findone", "zones", "rpcs"],
        type: PLUGIN_NAME
      },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: ["find", "findone", "adddashboarddata"]
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
      // {
      //   name: "individual",
      //   action: ["find", "findone"],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // }
    ],
    grantAllPermissions: false
  },
  "Zonal Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: [
          "getfeedbackforzone",
          "getquestionset",
          "findone",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone"]
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "document",
        action: ["find", "findone"]
      },
      {
        name: "activity",
        action: ["getquestionset", "getfeedbacksforactivityforzone"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["zoneevents", "getactivitiesforzonesrpcs", "organizations"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },

      {
        name: "state",
        action: ["find", "rpcs", "zones", "findone"],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: ["find", "findone", "adddashboarddata"]
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
    ],
    grantAllPermissions: false
  },
  "RPC Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: [
          "getquestionset",
          "findone",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "document",
        action: ["find", "findone"]
      },
      {
        name: "activity",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["rpcevents", "getactivitiesforzonesrpcs", "organizations"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "rpcs", "zones", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: ["find", "findone", "adddashboarddata"]
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
    ],
    grantAllPermissions: false
  },
  "College Admin": {
    controllers: [
      {
        name: "academic-history",
        action: ["create", "update", "delete"]
      },
      {
        name: "academic-year",
        action: ["find", "create", "update", "findone"]
      },
      {
        name: "activity-batch",
        action: ["student", "delete", "update", "create"]
      },
      {
        name: "education",
        action: ["create", "update", "delete"]
      },
      {
        name: "event",
        action: [
          "create",
          "deleteimage",
          "findone",
          "individual",
          "eligibleOrganizationIndividual",
          "update",
          "delete",
          "getquestionset",
          "getfeedbacksforeventfromcollege",
          "getstudentcommentsforeventfromcollege",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: ["find", "create", "update", "getfeedbacksforeventfromcollege"]
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "stream",
        action: ["find", "findone"]
      },
      {
        name: "futureaspirations",
        action: ["find"]
      },
      {
        name: "user",
        action: ["me", "findOne", "destroy"]
      },
      {
        name: "zone",
        action: ["find", "findone"]
      },
      {
        name: "student-import-csv",
        action: [
          "find",
          "findone",
          "create",
          "delete",
          "update",
          "import",
          "getFileImportDetails",
          "getRecords",
          "getImportedFileStatus"
        ]
      },
      {
        name: "document",
        action: ["find", "findone", "create", "update", "delete"]
      },
      {
        name: "activity",
        action: [
          "create",
          "findOne",
          "activitybatch",
          "download",
          "student",
          "getquestionset",
          "update",
          "getfeedbacksforeventfromcollege",
          "getfeedbacksforactivityforrpc"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: ["find", "findOne"],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [
          "academichistory",
          "documents",
          "education",
          "deletedocument",
          "eligiblepastactivities",
          "organizationstudents",
          "organizationadmins",
          "findone",
          "createindividual",
          "individualdetails",
          "editorganization",
          "organizationdetails",
          "approve",
          "unapprove",
          "individuals",
          "organizationevents",
          "eligiblepastevents",
          "eligibleEvents",
          "editindividual",
          "getOrganizationActivities",
          "rpcevents",
          "getactivitiesforzonesrpcs",
          "organizations",
          "delete",
          "deleteindividual"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "organization",
      //   action: [
      //     "find",
      //     "findone",
      //     "showStudents",
      //     "count",
      //     "event",
      //     "create",
      //     "delete",
      //     "update",
      //     "activity",
      //     "event",
      //     "admins",
      //     "studentregister",
      //     "deletestudents"
      //   ],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "individual",
      //   action: [
      //     "find",
      //     "findone",
      //     "update",
      //     "count",
      //     "create",
      //     "delete",
      //     "edit",
      //     "approve",
      //     "unapprove",
      //     "registeredevents"
      //   ],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "rpcs", "zones", "findone", "organizations"],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: ["find", "findone", "adddashboarddata"]
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
    ],
    grantAllPermissions: false
  },
  Student: {
    controllers: [
      {
        name: "academic-history",
        action: ["create", "update", "delete"]
      },
      {
        name: "academic-year",
        action: ["find", "findOne"]
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: ["create", "update", "delete"]
      },
      {
        name: "otp",
        action: [
          "requestotp",
          "validateotp",
          "requestotpforstudent",
          "checkotp",
          "updatecontact"
        ]
      },
      {
        name: "event",
        action: ["findone", "getquestionset"]
      },
      {
        name: "event-registration",
        action: ["create"]
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: []
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "futureaspirations",
        action: ["find"]
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "document",
        action: ["find", "findone", "create", "update", "delete"]
      },
      {
        name: "activity",
        action: ["findone", "getquestionset"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [
          "findone",
          "education",
          "academichistory",
          "eligiblepastactivities",
          "deletedocument",
          "eligibleEvents",
          "eligibleActivity",
          "individualregisteredevents",
          "individualdetails",
          "eligiblepastevents",
          "documents",
          "deletedocuments",
          "editindividual"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [
      //     "findone",
      //     "update",
      //     "education",
      //     "create",
      //     "edit",
      //     "document",
      //     "deletedocument",
      //     "academicHistory",
      //     "events",
      //     "registeredevents",
      //     "activity",
      //     "pastevents",
      //     "pastActivity"
      //   ],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["event", "activity"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
    ],
    grantAllPermissions: false
  },
  "Medha Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "otp",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: []
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: []
      },
      {
        name: "feedback-set",
        action: []
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "futureaspirations",
        action: []
      },
      {
        name: "user",
        action: []
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "student-import-csv",
        action: []
      },
      {
        name: "document",
        action: []
      },
      {
        name: "activity",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: []
      },
      {
        name: "dashboard-history",
        action: []
      }
    ],
    grantAllPermissions: true
  },
  "Department Admin": {
    controllers: [
      {
        name: "rpc",
        action: ["find"]
      },
      {
        name: "zone",
        action: ["find"]
      },
      {
        name: "contact",
        action: ["organizations"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "zones", "rpcs"],
        type: PLUGIN_NAME
      },
      {
        name: "dashboard",
        action: ["find"]
      },
      {
        name: "dashboard-history",
        action: ["find"]
      }
    ]
  }
};

const ALLOWED_MEDHA_ADMIN_ROUTES = ["getroles", "getrole"];

const uploadPermissions = ["upload"];

const PUBLIC_ROUTES = {
  controllers: [
    {
      name: "otp",
      action: ["requestotp", "validateotp", "requestotpforstudent", "checkotp"]
    },
    {
      name: "state",
      action: ["find"],
      type: PLUGIN_NAME
    },
    {
      name: "zone",
      action: ["find"]
    },
    {
      name: "rpc",
      action: ["find"]
    },
    // {
    //   name: "college",
    //   action: ["find"],
    // },
    // {
    //   name: "student",
    //   action: ["register"],
    // },
    {
      name: "contact",
      action: ["organizations", "createindividual"],
      type: PLUGIN_NAME
    },
    {
      name: "district",
      action: ["find"],
      type: PLUGIN_NAME
    },
    {
      name: "stream",
      action: ["find"]
    },
    {
      name: "futureaspirations",
      action: ["find"]
    },
    {
      name: "board",
      action: ["find"]
    },
    {
      name: "academic-year",
      action: ["find"]
    }
  ]
};

const ACTIVITY_TYPES = ["Training", "Workshop", "Industrial Visit"];

const BOARDS = [
  "CBSE",
  "CISCE",
  "NIOS",
  "UPBOARD",
  "JKBOSE",
  "RBSE",
  "HPBOSE",
  "MPBSE",
  "CGBSE",
  "PSEB",
  "BSEH",
  "ICSE",
  "BSEB",
  "GSEB",
  "MSBSHSE",
  "BIEAP",
  "BSEAP",
  "WBBSE",
  "WBCSHE",
  "BTEUP"
];

module.exports = {
  ACADEMIC_YEARS,
  COUNTRIES,
  STREAMS,
  uploadPermissions,
  ROLES,
  ALLOWED_MEDHA_ADMIN_ROUTES,
  PUBLIC_ROUTES,
  ACTIVITY_TYPES,
  FUTURE_ASPIRATIONS,
  BOARDS,
  QUESTION_SET
};
