const { Dataset } = requir('@thulium/internal');

Module = {};

Module.create = (data, user, cb) => {

  if (!data) throw new Error('Data must be provided');
  if (!data.title || !data.paradigm || !data.access) throw new Error('Data must contain title, paradigm and access.')
  if (!user) throw new Error('User must be provided.');

  const dataset = new Dataset({
    title: data.title,
    publisher: user._id,
    paradigm: data.paradigm,
    access: data.access
  });

  return cb ? Dataset.save() : Dataset.save().then(cb);
};

module.exports = Module;