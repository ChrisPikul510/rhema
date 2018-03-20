/**
 * Local node test program to check the library
 */
const fs = require('fs');
const Rhema = require('./lib/rhema').default;

const data = fs.readFileSync('./examples/test.rlp', { encoding: 'utf8' });
console.log('Read data from file', data.length);

const rhema = new Rhema();
rhema.parse(data, {})
    .then(() => {
        if(rhema.isProject) {
            //We recursively load the project files outside of the library because of the different platform-dependant ways
            //to load data. End user could want Node FS, or stream, or Fetch, etc.
            if(rhema.project.hasFiles()) {
                console.log('Recursively loading the files for project into rhema, file count = %d', rhema.project.countFiles());
                let proms = [];
                rhema.project.getFiles().forEach(file => {
                    const fdata = fs.readFileSync('./examples/'+file.href, { encoding: 'utf8'});
                    if(fdata) 
                        proms.push(rhema.parse(fdata));
                    else
                        throw new Error("Error reading file from project, probably doesn't exist");
                });
                return Promise.all(proms);
            } else return Promise.resolve();
        }
    })
    .then(() => {
        console.log('Completed loading of project file!');
        return rhema.export();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => console.error('Error parsing: ', err));