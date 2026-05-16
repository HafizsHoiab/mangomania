class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.search) {
      this.query = this.query.find({
        $text: { $search: this.queryStr.search },
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excluded = ['page', 'limit', 'sort', 'search', 'fields'];
    excluded.forEach(k => delete queryObj[k]);

    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) queryObj.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) queryObj.price.$lte = Number(queryObj.maxPrice);
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    if (queryObj.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
      delete queryObj.inStock;
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate(resPerPage = 12) {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || resPerPage;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

module.exports = ApiFeatures;
