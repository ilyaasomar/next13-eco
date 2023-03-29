class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // search by name
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }
  // filters category and price
  filters() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    // min and max price code are here
    // greater than and less than in express are simple but nextjs you making as manual for js code
    let output = {};
    let prop = "";
    for (let key in queryCopy) {
      console.log({ key: key });
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        output[key] = queryCopy[key];
      } else {
        prop = key.split("[")[0];
        console.log({ prop: prop });
        let operator = key.match(/\[(.*)\]/)[1];
        console.log({ operator: operator });
        if (!output[prop]) {
          output[prop] = {};
        }
        output[prop][`$${operator}`] = queryCopy[key];
      }
    }
    console.log("output", output);
    // {price : { $gte : 100, $lte : 1000 }}
    this.query = this.query.find(output);
    return this;
  }
  // pagination
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    // if your need to go page 2
    // resPerPage = 5 means all pages of the product
    // currentPage = 2
    // currentPage->2 - 1 = 1 * resPerPage->5 = 5 means skip that 5 product from that page
    // and go page 2 from product 6 to 10

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
export default APIFilters;
