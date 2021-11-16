const { default: axios } = require("axios");
const cheerio = require("cheerio");
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({ origin: true }));

app.listen(9000, () => {
  console.log("Application is running on port 9000");
});

const runtimeOpts = {
  memory: "2GB",
};

exports.getSchool = functions
  .runWith(runtimeOpts)
  .region("asia-northeast1")
  .https.onRequest(app);

// all = 45610
app.get("/getSchool", async function (req, res) {
  const Items = Array.from(Array(5610).keys());
  const schoolList = [];
  for (const index of Items) {
    const tableData = [];
    if (index !== 0) {
      console.log("index ; ", index + 40000);
      const res = await axios.get(
        `https://www.spu.ac.th/directory/school/${index + 40000}/`,
      );
      const html = res.data;
      const $ = cheerio.load(html);
      $(
        "body > div > div > section.dic-school-1 > div > div > div > table > tbody > tr",
      ).each((index, element) => {
        const tds = $(element).find("td");
        const schoolData = $(tds[1]).text();
        if (!schoolData) return;
        tableData.push(schoolData);
        console.log("---- success -----");
      });
    }

    schoolList.push(tableData);
  }
  if (schoolList.length > 0) {
    const data = schoolList.map((item, index) => {
      return item.reduce((list, current, index) => {
        list[index === 0 && "ชื่อโรงเรียน"] = current;
        list[index === 1 && "สังกัด"] = current;
        list[index === 2 && "ประเทภโรงเรียน"] = current;
        list[index === 3 && "แขวง"] = current;
        list[index === 4 && "ตำบล"] = current;
        list[index === 5 && "จังหวัด"] = current;
        list[index === 6 && "email"] = current;
        list[index === 6 && "website"] = current;
        return list;
      }, {});
    });

    data.splice(0, 1);
    if (data.length > 0) {
      var fs = require("fs");
      fs.writeFile("40000-end.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("complete");
      });
    }
  }
  res.send("Success");
});

// exports.helloWorld = functions.https.onRequest(async (request, response) => {
//   //   functions.logger.info("Hello logs!", { structuredData: true });
//   //   const getData = await axios.get(
//   //     `https://www.spu.ac.th/directory/school/province/1/`,
//   //   );
//   //   const html = getData.data;
//   //   const $ = cheerio.load(html);
//   //   const allLink = [];
//   //   $(
//   //     "body > div > div > section.dic-school-1 > div > div > div > table > tbody > tr > td > a",
//   //   ).each((index, element) => {
//   //     const link = $(element).attr("href").replace("/directory/", "");
//   //     allLink.push(
//   //       link,
//   //       //     {
//   //       //   link: `https://www.spu.ac.th/directory/${link}`.trim(),
//   //       // }
//   //     );
//   //     // const schoolDetail = cheerio.load(gotoSchoolDetail);
//   //     // console.log("schoolDetail : ", schoolDetail);
//   //     // const schoolName = $(schoolDetail[0]).text();
//   //   });
//   //   const Items = 45610;
//   const Items = Array.from(Array(45610).keys());
//   const schoolList = [];
//   for (const index of Items) {
//     const tableData = [];
//     if (index !== 0) {
//       console.log("index ; ", index);
//       const res = await axios.get(
//         `https://www.spu.ac.th/directory/school/${index}/`,
//       );
//       const html = res.data;
//       const $ = cheerio.load(html);
//       $(
//         "body > div > div > section.dic-school-1 > div > div > div > table > tbody > tr",
//       ).each((index, element) => {
//         const tds = $(element).find("td");
//         const schoolData = $(tds[1]).text();
//         if (!schoolData) return;
//         tableData.push(schoolData);
//       });
//     }

//     schoolList.push(tableData);
//   }
//   if (schoolList.length > 0) {
//     const data = schoolList.map((item, index) => {
//       return item.reduce((list, current, index) => {
//         list[index === 0 && "ชื่อโรงเรียน"] = current;
//         list[index === 1 && "สังกัด"] = current;
//         list[index === 2 && "ประเทภโรงเรียน"] = current;
//         list[index === 3 && "แขวง"] = current;
//         list[index === 4 && "ตำบล"] = current;
//         list[index === 5 && "จังหวัด"] = current;
//         list[index === 6 && "email"] = current;
//         list[index === 6 && "website"] = current;
//         return list;
//       }, {});
//     });

//     data.splice(0, 1);
//     if (data.length > 0) {
//       var fs = require("fs");
//       fs.writeFile("data.json", JSON.stringify(data), function (err) {
//         if (err) throw err;
//         console.log("complete");
//       });
//     }
//   }
//   response.send("Hello from Firebase! 11");
// });
