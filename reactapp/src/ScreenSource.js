import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)
  const [userTokenFromStore, setUserTokenFromStore] = useState(props.userToken) 
  const [imageBorderFr, setImageBorderFr] = useState(imageNoBorder)
  const [imageBorderEn, setImageBorderEn] = useState(imageNoBorder)

  var imageBorder = {
    width:'60px', 
    margin:'10px',
    cursor:'pointer',
    borderStyle:'solid',
    borderColor:'white',
    borderWidth:2,
    borderRadius:'50%',
    padding:1
  }

  var imageNoBorder = {
    width:'40px', 
    margin:'10px',
    cursor:'pointer'
  }

  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'
      setImageBorderFr(imageBorder)
      setImageBorderEn(imageNoBorder)
        
      if(selectedLang == 'en'){
        var langue = 'en'
        var country = 'us'
        setImageBorderFr(imageNoBorder)
        setImageBorderEn(imageBorder)
      }
      props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=0ecb411530894d189bfe84286990cf7f`)
      const body = await data.json()
      setSourceList(body.sources)
    }
    APIResultsLoading()

    const setUserLanguage = async() => {
      console.log('selectedLang', selectedLang);
      console.log('userTokenFromStore', userTokenFromStore);

      const writeLangInDb = await fetch(`/set-language?token=${userTokenFromStore}&lang=${selectedLang}`);
      console.log(writeLangInDb);
    }
    setUserLanguage();

  }, [selectedLang])

  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={imageBorderFr} src='/images/fr.png' onClick={() => setSelectedLang('fr')} />
          <img style={imageBorderEn} src='/images/uk.png' onClick={() => setSelectedLang('en')} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return {selectedLang: state.selectedLang, userToken: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
