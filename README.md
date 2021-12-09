# n8n-nodes-starter

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

Example starter module for custom n8n nodes.


## Try it out

Clone the repo and execute: 
```
cd n8n-nodes-starter
npm install
npm run build
npm link
```

After that add it to an N8N installation: 
```
cd ..
mkdir n8n_install
cd n8n_install
npm init
npm install
npm install n8n
npm link n8n-nodes-starter
npx n8n
```


## License

[Apache 2.0 with Commons Clause](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/LICENSE.md)


