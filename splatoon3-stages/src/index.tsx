import { ActionPanel, List, Action } from "@raycast/api";

import useSWR from 'swr'
import fetch from 'node-fetch'
import { FC } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Schedule = {
  start_time: string
  end_time: string
  rule: {
    key: string
    name: string
  }
  stages: {
    id: string
    name: string
    image: string
  }[]
}

type Response = {
  result: {
    regular: Schedule[]
    bankara_challenge: Schedule[]
    bankara_open: Schedule[]
    x: Schedule[]
  }
}

export default function Command() {
  const { data, isLoading } = useSWR<Response>('https://spla3.yuu26.com/api/schedule', fetcher)

  if (isLoading) {
    return <List isLoading={isLoading} />
  }

  const regular = data?.result.regular[0]
  const bankaraChallenge = data?.result.bankara_challenge[0]
  const bankaraOpen = data?.result.bankara_open[0]
  const x = data?.result.x[0]

  return (
    <List
      isShowingDetail={true}
    >
      {regular &&
        <List.Item
          icon="list-icon.png"
          title={"レギュラーマッチ"}
          detail={<ScheduleDetail schedule={regular} />}
          subtitle={regular.rule.name}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<ScheduleList title="レギュラーマッチ" schedules={data?.result.regular} />} />
            </ActionPanel>
          }
        />
      }
      {bankaraChallenge &&
        <List.Item
          icon="list-icon.png"
          title={"バンカラ チャレンジ"}
          detail={<ScheduleDetail schedule={bankaraChallenge} />}
          subtitle={bankaraChallenge.rule.name}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<ScheduleList title="バンカラマッチ（チャレンジ）" schedules={data?.result.bankara_challenge} />} />
            </ActionPanel>
          }
        />
      }
      {bankaraOpen &&
        <List.Item
          icon="list-icon.png"
          title={"バンカラ オープン"}
          detail={<ScheduleDetail schedule={bankaraOpen} />}
          subtitle={bankaraOpen.rule.name}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<ScheduleList title="バンカラマッチ（オープン）" schedules={data?.result.bankara_open} />} />
            </ActionPanel>
          }
        />
      }
      {x &&
        <List.Item
          icon="list-icon.png"
        title={"Xマッチ"}
        detail={<ScheduleDetail schedule={x} />}
        subtitle={x.rule.name}
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<ScheduleList title="Xマッチ" schedules={data?.result.x} />} />
          </ActionPanel>
        }
      />
      }
    </List>
  );
}

const ScheduleList: FC<{
  schedules: Schedule[]
  title: string
}> = ({ schedules, title }) => {
  return <List isShowingDetail>
    <List.Section title={title}>
      {schedules.map((schedule, index) => {
        const date = new Date(schedule.start_time)
        const dateString = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
        return <List.Item
          key={index}
          title={dateString}
          detail={<ScheduleDetail schedule={schedule} />}
          subtitle={schedule.rule.name}
        />
      })}
    </List.Section>
  </List>
}

const ScheduleDetail: FC<{
  schedule: Schedule
}
> = ({ schedule }) => {
  return <List.Item.Detail
    markdown={`
${schedule.stages.map(stage => {
  return `![](${stage.image})

${stage.name}
`}).join('\n')}
`}
  />
}
