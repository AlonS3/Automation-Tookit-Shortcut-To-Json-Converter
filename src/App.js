import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';


const error = 'Shortcut File Text is not valid';

const headerProp = "event.data = '"


function App() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [jsonObject, setJsonObject] = useState({})
  const [isValid, setIsValid] = useState(false)

  const clearInput = () => {
    setInput("")
  }

  const handleInputChange =  (e) => {
    setInput(e.target.value)
  }

  const handleDownloadButtonClick = () => {


    // Convert JSON object to string
    const jsonString = output;

    // Create a Blob with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element and set its attributes
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jsonObject[1].name}.json`;

    // Programmatically click the link to trigger the download
    link.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {

    const index = input.indexOf(headerProp)
    if (index !== -1) {
      const jsonText = input.substring(index+ headerProp.length, input.length);
      // Split the string into lines
      let lines = jsonText.split("\n");
      if (lines.length){
        let jsonString = lines[0];
        if (jsonString.charAt(jsonString.length - 1) === "'"){
          // Remove the last character
          jsonString = jsonString.slice(0, -1);

          if (jsonString){
            
            try{
              jsonString = jsonString.replace(/\\\\/g, "\\").replace(/\\'/g, "'")
              const json = JSON.parse(jsonString)
              if (json.hasOwnProperty("version") && json.hasOwnProperty("json")){
                delete json.json.write_external_files
                delete json.json.run_external_code
                const finalJson = [{version: json.version},json.json];

                setJsonObject(finalJson)
                setOutput(JSON.stringify(finalJson,undefined,"    "))
                setIsValid(true)
              }
              else{
                setOutput("json validation error")
                setIsValid(false)
                setJsonObject({})
              }
              
            }catch(err){
              setOutput("json parsing error")
              setIsValid(false)
              setJsonObject({})
            }
          }
          else{
            setOutput("empty json object")
            setIsValid(false)
            setJsonObject({})
          }
        }
        else{
          setOutput(error)
          setIsValid(false)
          setJsonObject({})
        }
      }
      else{
        setOutput(error)
        setIsValid(false)
        setJsonObject({})
      }
    }
    else{
      setOutput(error)
      setIsValid(false)
      setJsonObject({})
    }

    

  }, [input])



  return (
    <div className="App">
      <header className="App-header shadow-sm p-3 border-bottom">
        <h3 className='text-primary-emphasis pe-5'>Automation Toolkit - Shortcut File To Json File</h3>
      </header>
      <div className='container'>
        <p className='text-center fs-5 fw-normal p-3 m-3'>This website converts Automation Toolkit shortcut file back to json file.</p>
        <InputGroup size="lg">
          <InputGroup.Text className='text-wrap fs-6'>Original<br/>Shortcut File<br/>Content</InputGroup.Text>
          <Form.Control as="textarea" aria-label="With textarea" placeholder="Paste here the shortcut file content" className='fs-6' style={{height: "300px"}} value={input} onChange={handleInputChange}/>
        </InputGroup>
        <Button variant="danger" className='my-4' onClick={clearInput}>Clear</Button>
        <InputGroup size="lg">
          <InputGroup.Text className='fs-6'>Result Json</InputGroup.Text>
          <Form.Control as="textarea" aria-label="With textarea" className={!isValid ? 'text-danger fs-6' : 'fs-6'} readOnly style={{height: "300px"}} value={output}/>
        </InputGroup>
        <Button variant={isValid ? "success" : "secondary"} className='my-4' disabled={!isValid} onClick={handleDownloadButtonClick}>Download Automation</Button>
      </div>
    </div>
  );
}

export default App;
