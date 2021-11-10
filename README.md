# Predicting Patient Issues

---

For dependency installation, use the pipreqs module to generate a requirements.txt

Use this command to install pipreqs:
`pip3 install pipreqs`

Once the pipreqs module is installed, move the current working directory to /api and generate the requirements.txt by:
`python3 -m pipreqs.pipreqs .`

To install modules from requirements.txt, run this command:
`pip3 install -r requirements.txt`

This will install all necessary Python modules to run the backend service. Make sure to do this process with each fetch/pull.

---

##### Requirements for ReactJS development:

- NodeJS runtime
- npm (NodeJS package manager)

NodeJS/npm documentation & installation: [https://nodejs.org/en/](https://nodejs.org/en/)
ReactJS documentation: [https://reactjs.org/](https://reactjs.org/)

##### Running ReactJS frontend

After installing the requirements listed above, move the current working directory to /frontend.

If it is the first time running this project (after initially pulling code), you will not have the _node_modules_ folder. Install the npm requirements found in the _package.json_ file: `npm install`. If you already have the _node_modules_ folder, you can skip the previous step.

Start the development server: `npm start`

The development server should be accessible at [http://localhost:3000](http://localhost:3000).
