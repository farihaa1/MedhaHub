import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /* ==========================================
     Search
  ========================================== */

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }

    return this;
  }

  /* ==========================================
     Filter
  ========================================== */

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = [
      "searchTerm",
      "sortBy",
      "sortOrder",
      "limit",
      "page",
      "fields",
    ];

    excludeFields.forEach((field) => delete queryObj[field]);

    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  /* ==========================================
     Sort
  ========================================== */

  sort() {
    const sortBy = this.query.sortBy as string;
    const sortOrder = this.query.sortOrder === "asc" ? 1 : -1;

    if (sortBy) {
      this.modelQuery = this.modelQuery.sort({
        [sortBy]: sortOrder,
      });
    }

    return this;
  }

  /* ==========================================
     Pagination
  ========================================== */

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  /* ==========================================
     Fields
  ========================================== */

  fields() {
    const fields =
      (this.query.fields as string)?.split(",").join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  /* ==========================================
     Count
  ========================================== */

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(totalQueries);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;
