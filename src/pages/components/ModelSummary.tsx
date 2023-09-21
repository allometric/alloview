import { FC } from 'react';
import { Model } from '@customTypes/model';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const formatFuncStr = (model: Model) => {
  

  return model.predict_fn_body[0]
};


export const ModelSummary: FC<Model> = (props: Model) => {
  return(
    <div className='modelSummary'>
      <Tabs>
        <TabList>
          <Tab>R</Tab>
          <Tab>Parameters</Tab>
        </TabList>

        <TabPanel>
          <SyntaxHighlighter language='r'>
            {formatFuncStr(props)}
          </SyntaxHighlighter>
        </TabPanel>
        <TabPanel>
        </TabPanel>
      </Tabs>
    </div>
  )
}