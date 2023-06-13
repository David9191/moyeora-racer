/**
 *
 * @param {*} plan
 * @description 클라이언트 데이터 구조를 서버 데이터 구조로 맞춰주는 함수
 * @example 'aa\nbb\n' -> [{url: 'aa'}, {url: 'bb'}, {url: 'cc'}]
 */
export const changePlanForm = (plan) => {
  const newLinks = plan.links.split('\n').map((link) => {
    return { url: link };
  });
  const newContents = { ...plan, links: newLinks };

  newContents.start_date = newContents.startDate;
  newContents.end_date = newContents.endDate;
  delete newContents.startDate;
  delete newContents.endDate;

  return newContents;
};