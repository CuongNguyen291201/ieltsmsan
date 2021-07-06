import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePaginationState, useTotalPagesState } from '../../../hooks/pagination';
import { prepareGoToGameAction } from '../../../redux/actions/prepareGame.actions';
import { setUserCardDataAction } from '../../../redux/actions/topic.action';
import { GAME_STATUS_PREPARE_REVIEW } from '../../../sub_modules/game/src/gameConfig';
import { response_status_codes } from '../../../sub_modules/share/api_services/http_status';
import { EXAM_SCORE_FINISH } from '../../../sub_modules/share/constraint';
import { StudyScore } from '../../../sub_modules/share/model/studyScore';
import Topic from '../../../sub_modules/share/model/topic';
import { UserInfo } from '../../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeClock, getGameSlug } from '../../../utils';
import { fetchPaginationAPI } from '../../../utils/apis/common';
import { apiCountTopicStudyScores, apiGetUserExamCardData, apiOffsetRankingsByTopic, apiSeekRankingsByTopic } from '../../../utils/apis/topicApi';
import LinkPagination from '../../LinkPagination';
import { SortingOpts, TypeSort } from './config';
import './style.scss';
const { SCORE_DESC, SCORE_ASC, LATEST, EARLIEST } = SortingOpts;

const TopicRankingsView = (props: { topic: Topic }) => {
  const { topic } = props;
  const [sortingOpts, setSortOpts] = useState<{ numRanks: number; sortBy: TypeSort; asc: boolean }>({
    numRanks: 20, sortBy: 'currentIndex', asc: false
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchRankings = async (args: {
    topicId: string; lastRecord?: StudyScore; skip?: number; limit?: number; field?: TypeSort; asc?: boolean;
  }) => fetchPaginationAPI<StudyScore>({ ...args, seekAPI: apiSeekRankingsByTopic, offsetAPI: apiOffsetRankingsByTopic });

  const { pages, onChangePage } = usePaginationState<StudyScore>({
    keys: [topic._id], keyName: 'topicId', fetchFunction: fetchRankings, itemsPerPage: sortingOpts.numRanks, filters: { field: sortingOpts.sortBy, asc: sortingOpts.asc }
  });

  const { mapTotalPages, mapTotal } = useTotalPagesState({
    keys: [topic._id], keyName: 'topicId', api: apiCountTopicStudyScores, itemPerPages: sortingOpts.numRanks, filters: { status: EXAM_SCORE_FINISH }
  });

  const pageData = pages[topic._id]?.data;
  const currentPage = pages[topic._id]?.currentPage;
  const totalItems = mapTotal[topic._id];

  const handleChangeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    let options: { field: 'currentIndex' | 'lastUpdate'; asc: boolean };
    if (value === SCORE_DESC.key) options = SCORE_DESC.value;
    else if (value === SCORE_ASC.key) options = SCORE_ASC.value;
    else if (value === LATEST.key) options = LATEST.value;
    else if (value === EARLIEST.key) options = EARLIEST.value;
    if (options) setSortOpts({ ...sortingOpts, sortBy: options.field, asc: options.asc });
  }

  const handleChangeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setSortOpts({ ...sortingOpts, numRanks: value });
  }

  const getUserExamCardDataFC = async (studyScore: StudyScore) => {
    const { data, status } = await apiGetUserExamCardData({ topicId: topic._id, studyScore, type: topic.type, userId: studyScore.userId });
    if (status === response_status_codes.success) dispatch(setUserCardDataAction({ cardData: data, user: new UserInfo({ _id: studyScore.userId, name: studyScore.userName }) }));
  }

  const handleReview = (studyScore: StudyScore) => {
    getUserExamCardDataFC(studyScore)
      .then(() => {
        dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore }));
      })
      .then(() => router.push(getGameSlug(topic._id)));
  }

  return (
    <div className="topic-rankings">

      <div className="rank-filter">
        <div className="filter-option">
          <label htmlFor="sort-by">Sắp xếp </label>
          <select name="sort-by" id="sort-by" defaultValue={SCORE_DESC.key} onChange={(e) => handleChangeFilter(e)}>
            <option value={SCORE_DESC.key}>Điểm cao nhất</option>
            <option value={SCORE_ASC.key}>Điểm thấp nhất</option>
            <option value={LATEST.key}>Mới nhất</option>
            <option value={EARLIEST.key}>Cũ nhất</option>
          </select>
        </div>

        <div className="filter-option">
          <label htmlFor="limit-filter">Hiển thị </label>
          <select name="limit-filter" id="limit-filter" defaultValue="20" onChange={(e) => handleChangeLimit(e)}>
            <option value="20">20 dòng</option>
            <option value="30">30 dòng</option>
            <option value="50">50 dòng</option>
          </select>
        </div>
      </div>

      <div className="tbl-rankings">
        <div className="tbl-head">
          <div className="tbl-cell">STT</div>
          <div className="tbl-cell">Họ tên</div>
          <div className="tbl-cell">Ngày thi</div>
          <div className="tbl-cell">Kết quả</div>
          <div className="tbl-cell">Thời gian</div>
          <div className="tbl-cell">Chi tiết</div>
        </div>

        {!!pageData && !!pageData[currentPage] && pageData[currentPage].map((e, i) => (
          <div className="tbl-row" key={e._id || i}>
            <div className="tbl-cell">{i + 1}</div>
            <div className="tbl-cell">{e.userName}</div>
            <div className="tbl-cell">{formatDateDMY(e.lastUpdate || e.registerDate)}</div>
            <div className="tbl-cell">{`${e.score}/10`}</div>
            <div className="tbl-cell">{formatTimeClock(e.totalTime)}</div>
            <div className="tbl-cell">
              <i
                className="fas fa-info action"
                onClick={() => handleReview(e)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {!!totalItems && !!pageData && !!currentPage && !!mapTotalPages[topic._id] && <LinkPagination
          total={totalItems}
          totalPages={mapTotalPages[topic._id]}
          currentPage={currentPage}
          startIndex={(currentPage - 1) * sortingOpts.numRanks + 1}
          endIndex={(currentPage - 1) * sortingOpts.numRanks + pageData[currentPage].length}
          onClick={(page: number) => onChangePage({ page, key: topic._id })}
        />}
      </div>
    </div>
  )
}

export default TopicRankingsView;
