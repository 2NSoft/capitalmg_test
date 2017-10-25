class BaseModel {
    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new this();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });
        return viewModel;
    }
}

module.exports = BaseModel;
