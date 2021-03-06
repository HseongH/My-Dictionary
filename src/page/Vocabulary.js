// LIBRARY
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// REDUX
import { useSelector, useDispatch } from 'react-redux';

// FIREBASE
import { loadMoreVocaFB, removeVocaFB } from '../firebase/method';

// STYLE
import '../style/css/vocabulary.css';

// ICON
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const Vocabulary = (props) => {
  const dispatch = useDispatch();
  const vocaData = useSelector((state) => state.voca);
  const vocaList = vocaData.list;
  const date = vocaData.date;

  const [target, setTarget] = useState(null);

  useEffect(() => {
    const options = { threshold: 1 };

    const infiniteScroll = ([entries], observer) => {
      if (entries.isIntersecting) {
        new Promise((resolve) => {
          resolve(dispatch(loadMoreVocaFB(date)));
        }).then((res) => observer.unobserve(entries.target));
      }
    };

    const io = new IntersectionObserver(infiniteScroll, options);
    if (target) io.observe(target);

    return () => io && io.disconnect();
  }, [target, date, dispatch]);

  const removeVoca = (index) => {
    dispatch(removeVocaFB(index));
  };

  return (
    <section className="section section--contents">
      <div className="container">
        {vocaList.map((elem, idx) => {
          const isLast = idx === vocaList.length - 1;

          return (
            <div className="Card" key={idx} ref={isLast ? setTarget : null}>
              <div className="card__container word">
                <h2 className="title">용어</h2>
                <p className="contents">{elem.word}</p>
              </div>

              <div className="card__container desc">
                <h2 className="title">설명</h2>
                <p className="contents">{elem.desc}</p>
              </div>

              <div className="card__container url">
                <a className="contents" href={elem.url} target="_blank" rel="noreferrer">
                  바로가기
                </a>
              </div>

              <div className="btn-group">
                <Link to={`/modify?index=${idx}`}>
                  <button className="btn btn--modify">
                    <EditIcon />
                  </button>
                </Link>

                <button
                  onClick={() => {
                    removeVoca(idx);
                  }}
                  className="btn btn--delete"
                >
                  <DeleteForeverIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Vocabulary;
