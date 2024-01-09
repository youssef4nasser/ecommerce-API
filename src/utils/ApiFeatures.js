
export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    // pagination
    paginate(){
        let page = this.queryString.page * 1 || 1
        if(this.queryString.page <= 0) page = 1

        const SKIP = (page - 1) * 10
        this.page = page
        this.mongooseQuery.skip(SKIP).limit(10);
        return this
    }
    
    // Filter
    filter(){
        let filterObj = {...this.queryString}
        let excludedQuery = ['page', 'sort', 'fields', 'keyword']
        excludedQuery.forEach((q)=>{
            delete filterObj[q]
        })
        
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

    // sort
    sort() {
        if(this.queryString.sort){
            this.mongooseQuery.sort(this.queryString.sort.split(',').join(' '))
        }
        return this
    }

    // search
    search(){
        if(this.queryString.keyword){
            this.mongooseQuery.find({
                $or: [
                    {name: {$regex: this.queryString.keyword, $options:'i'}},
                    {description: {$regex: this.queryString.keyword, $options:'i'}}
                ]
            })
        }
        return this
    }

    // selected fields
    fields(){
        if(this.queryString.fields){
            this.mongooseQuery.select(this.queryString.fields.split(',').join(' '))
        }
        return this
    }
}