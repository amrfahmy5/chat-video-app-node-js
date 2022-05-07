const { database } = require("../services/db");

module.exports = {
  async queryBuilder() {
    // return await database
    //   .table("khaledProjects")
    //   .leftJoin("khaledimage", async function () {
    //     this.on("khaledimage.project_id","=","khaledProjects.id");
    //     this.onVal(
    //       "khaledimage.image_id","=",database.table("khaledimage").min("khaledimage.image_id")
    //     );
    //   })
    //   .select("*");
  },
};
