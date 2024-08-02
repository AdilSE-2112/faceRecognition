import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/searchContext";
import Layout from "../../components/layout";
import "./style.scss";
import { HiDotsVertical, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import mockPhoto from "../home/1000.jpg";
import { MdRepeatOn } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import getDateAndTime from "../../utils/getDateAndTime";


const HistoryPage = () => {
  const searchContext = useSearch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { token, auth_user_id } = useAuth();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const maxPerPage = 10;
  const [result, setResult] = useState(null);

  const handleRepeatSearch = (file, iin) => {
    searchContext.setFile(file);
    searchContext.setIIN(iin);
    navigate("/search/result");
  };

  useEffect(() => {
    console.log(auth_user_id, token);
    const _auth_user_id = auth_user_id || localStorage.getItem('auth_user_id') || 2
    
    axios.get(
      `http://192.168.122.101:8000/api/v1/account/history/${_auth_user_id}/`,
      {
        headers: { 'Authorization': 'Bearer ' + token },
      }
    ).then(res => {
      setResult(res.data);
      console.log(res.data);
      setPage(1);
      setMaxPage(Math.ceil(res.data.count / maxPerPage))
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })
  }, [])

  const updatePage = (page) => {
    const _auth_user_id = auth_user_id || localStorage.getItem('auth_user_id') || 2
    
    axios.get(
      `http://192.168.122.101:8000/api/v1/account/history/${_auth_user_id}/`,
      {
        params: {
          'page': page
        },
        headers: { 'Authorization': 'Bearer ' + token },
      },
    ).then(res => {
      setResult(res.data);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })
  }

  return (
    <Layout>
      <div className="history-page">
        <div className="container">
          <div className="prev-requests">
            <div className="title">История запросов</div>
            {
              !loading 
                ? (
                  <div className="cards">
                    {
                      result.results.map((item, index) => {

                        return <SearchCard
                          key={index}
                          history={item}
                          onRepeatSearch={handleRepeatSearch}
                        />
                      })
                    }
                  </div>
                ) : (
                  <div>loading</div>
                ) 
            }
          </div>

          <div className="page-control" >
            <HiOutlineChevronDoubleLeft 
              onClick={() => {
                setPage(1);
                updatePage(1)
              }}
            />
            <HiOutlineChevronLeft 
              onClick={() => {
                let newPage = page;
                if (newPage - 1 <= 1) newPage = 1;
                else newPage -= 1;

                setPage(newPage);
                updatePage(newPage);
              }}
            />
            <div className="page-indicator">{page} - {maxPage}</div>
            <HiOutlineChevronRight 
              onClick={() => {
                let newPage = page;
                if (newPage + 1 >= maxPage) newPage = maxPage;
                else newPage += 1;

                setPage(newPage);
                updatePage(newPage);
              }}
            />
            <HiOutlineChevronDoubleRight 
              onClick={() => {
                setPage(maxPage);
                updatePage(maxPage);
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SearchCard = ({ history, onRepeatSearch }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [photo, setPhoto] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { auth_user_id, token } = useAuth();
  const searchContext = useSearch();
  const [searching, setSearching] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const { devMode } = useAuth();

  const PHOTO_URL = 'http://192.168.122.101:9000/history/';

  useEffect(() => {
    setPhoto(`${PHOTO_URL}${history.searchedPhoto}`);

    const [_date, _time] = getDateAndTime(history.created_at);
    setDate(_date);
    setTime(_time);
  }, [history]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setInfoOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRepeatSearchClick = async () => {
    const data = new FormData();
    data.append('image_name', history.searchedPhoto);
    data.append('limit', 10);
    data.append('auth_user_id', auth_user_id);
    data.append('reload', 1);

    console.log(token, auth_user_id, history.searchedPhoto)

    await axios.post(
      'http://192.168.122.101:8000/api/v1/search/',
      data,
      {
        headers: { 'Authorization': 'Bearer ' + token },
      },
    ).then((response) => {
      searchContext.setLastRequest(response.data);
      console.log(response.data);
      setSearching(false); // Set searching to false when search is complete
      navigate('/search/result');
    }).catch((error) => {
      console.log(error);
      setSearching(false); // Set searching to false if an error occurs
    });
  };

  return (
    <div className="card">
      <img src={photo} alt={date} />
      <div className="info-block">
        <HiDotsVertical
          className="hiDotsicon"
          onClick={() => setInfoOpen((prev) => !prev)}
        />
        {infoOpen ? (
          <div className="info">
            <div>Дата поиска: </div>
            <div>{date}</div>
            <div>{time}</div>
          </div>
        ) : null}
      </div>
      <div className="repeat-block">
        <MdRepeatOn className="repeatIcon" onClick={handleRepeatSearchClick} />
      </div>
    </div>
  );
};

export default HistoryPage;
