import {
  FC,
  useEffect,
  useState,
  createContext,
  useContext,
  useRef
} from 'react';
import { Model, Taxon, Variable } from '../types/model';
import { useParams } from 'react-router-dom';
import { ModelCall } from '../components/ModelCall';
import {
  List, ListItem, ListItemIcon,
  ListItemText, IconButton, Typography, Box
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ForestIcon from '@mui/icons-material/Forest';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// @ts-expect-error asdf
import Cite from 'citation-js'
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const titleCase = (str: string) => {
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1);
    }
    return splitStr.join(' ');
}

const ModelContext = createContext<Model | undefined>(undefined);

// Create a hook for consuming the ModelContext
export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
};

const Header: FC = () => {
  const model = useModel();

  return(
    <div className='modelHeader'>
      <h1>{titleCase(model.model_type) + " Model via " + model.inline_citation}</h1>
    </div>
  )
}

const VariableListItem: FC<Variable> = (props: Variable) => {
  return(
    <div className='variableListItem'>
       {props.name} [{props.unit}]: {props.description}
    </div>
  )
}


const fmtFnCall = (covariateNames: string[]) => {
  const covtsCommas = covariateNames.join(', ')

  return('mod <- function(' + covtsCommas + ') {')
}

const fmtFnBody = (fn_body: string[]) => {
  const indented = fn_body.map(line => `  ${line}\n`)

  return(indented + '}')
}

const fmtFn = (covariateNames: string[], fn_body: string[]) => {
  const call = fmtFnCall(covariateNames)
  const body = fmtFnBody(fn_body)

  return(call + '\n' + body)
}

interface ModelRCodeProps {
  responseName: string,
  covariateNames: string[],
  fn_body: string[]
}

const ModelRCode: FC<ModelRCodeProps> = (props: ModelRCodeProps) => {
  const formattedBody = fmtFn(props.covariateNames, props.fn_body)

  const codeRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [])

  


  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(formattedBody)
        .catch((err) => {
          console.error('Failed to copy code:', err);
        });
    } else {
      console.error('Clipboard API is not available');
    }
  };

  return(
    <Box className='modelRCode' sx={{ position: 'relative', borderRadius: 2 }}>
      <Typography component="pre" sx={{fontSize: '14px'}}>
        <code ref={codeRef} className='r'>{formattedBody}</code>
      </Typography>
      <IconButton sx={{position: 'absolute', top: 8, right: 8}} onClick={handleCopy}>
        <ContentCopyIcon></ContentCopyIcon>
      </IconButton>
    </Box>
  )
}

const CallDescription: FC = () => {
  const model = useModel();

  return(
    <div className='callDescription'>
      <h2>Model Call</h2>
      <ModelCall
        isOpened={false}
        response = {model.response}
        covariates = {model.covariates}
      />
      <div className='variableList' style = {{paddingTop: "5px", paddingLeft: "10px"}}>
        <div className='responseDescription'>
          <VariableListItem
            name={model.response.name}
            key={model.response.name}
            unit={model.response.unit}
            description={model.response.description}
          />
        </div>
        <div className='covtDescription'>
          {model.covariates.map((covt) => 
            <VariableListItem
              name={covt.name}
              key={covt.name}
              unit={covt.unit}
              description={covt.description}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface GeographicContextProps {
  country: string[] | null;
  region: string[] | null;
}

const GeographicContext: FC<GeographicContextProps> = (props: GeographicContextProps) => {
  return(
    <>
      <ListItem>
        <ListItemIcon>
          <MyLocationIcon/>
        </ListItemIcon>
        <ListItemText primary="Geographic Context"></ListItemText>
      </ListItem>
      <List>
        {props.country?.map(country =>
            <ListItemText>{country}</ListItemText>
        )}
        {props.region?.map(country =>
            <ListItemText>{country}</ListItemText>
        )}
      </List>
    </>
  )
}

interface TaxonomicContextProps {
  taxa: Taxon[];
}

const TaxonomicContext: FC<TaxonomicContextProps> = (props: TaxonomicContextProps) => {
  return(
    <>
      <ListItem>
        <ListItemIcon>
          <ForestIcon/>
        </ListItemIcon>
        <ListItemText primary="Taxonomic Context"></ListItemText>
      </ListItem>
      <List>
        {props.taxa.map(taxa => 
          <ListItemText>
            {taxa.family ?? ''} {taxa.genus ?? ''} {taxa.species ?? ''}
          </ListItemText>
        )}
      </List>
    </>
  )
}

interface OtherDescriptorsProps {
  otherDescriptors: Record<string, any[]> | null
};

function snakeToTitleCase(str: string): string {
  return str
    .split('_') // Split by underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
    .join(' '); // Join words with a space
}

const OtherDescriptors: FC<OtherDescriptorsProps> = (props: OtherDescriptorsProps) => {
  return(
    <>
        {
          props.otherDescriptors ?         
          Object.entries(props.otherDescriptors).map(([key, value]) => {
            if(value.length > 0) {
              return (
                <>
                <ListItemText>{snakeToTitleCase(key)}</ListItemText>
                <List>
                  {
                    value.map(val => <ListItem>{val}</ListItem>)
                  }
                </List>
                </>
              )
            }
          }) : null
        }
    </>
  )
}

const Descriptors: FC = () => {
  const model = useModel();

  // TODO Rather than spawning one 'descriptors' accordion, this dynamically
  // chooses some to display if they exist: countries/regions and taxa
  // the others will be hidden in an optional expandable element later.

  const { country, region, taxa, ...otherDescriptors } = model.descriptors 

  return(
    <>
    <h2>Descriptors</h2>
    <List>
      {
        Object.keys(model.descriptors).some(key => key === 'region' || key === 'country') ?
          (<GeographicContext
            country={country}
            region={region}
          />) : null
      }
      {
        Object.keys(model.descriptors).includes("taxa") ?
          (
            <TaxonomicContext
              taxa={taxa}
          />): null
      }
      {
        (
          <OtherDescriptors
            otherDescriptors={otherDescriptors}  
        />)
      }
    </List>
    </>
  )
}

const Citation: FC = () => {
  const model = useModel();

  const citationParsed = new Cite(model.citation)
  const citationFmt = citationParsed.format('bibliography', {
    format: 'text',
    template: 'chicago'
  })

  console.log(citationParsed)

  return(
    <>{citationFmt}</>
  )
}

const ModelDetails: FC = () => {
  const { id } = useParams<{id: string}>();
  const [model, setModel] = useState<Model |null>(null);
  //const [citation, setCitation] = useState<Model |null>(null);

  useEffect(() => {
    const urlStr = 'https://api.allometric.org/model/' + id + '?citation=true'

    const fetchModel = async() => {
      const response = await fetch(urlStr, {method: 'GET'})
      const res: Model = await response.json()
      setModel(res)
    }

    fetchModel()
  }, [id]);

  return(
      <div className='modelDetailsContainer'>
        {model ? (
          <ModelContext.Provider value = {model}>
            <Header/>
            <div className='modelItemsContainer'>
              <ModelRCode
                responseName={model.response.name}
                covariateNames={model.covariates.map(covt => covt.name)}
                fn_body={model.predict_fn_body_populated}
              />
              <CallDescription/>
              <Descriptors/>
            </div>
          </ModelContext.Provider>
        ) : (
          <p>Loading model...</p>
        )}
      </div>
    );
}

export default ModelDetails;