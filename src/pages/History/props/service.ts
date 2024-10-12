import { request } from "@umijs/max";

export async function pageQuery(params: any) {
	return request(`/easy-flowable/model/historyPage`, {
		method: 'POST',
		data: params
	})
}

export async function rollback(historyId: string) {
	return request(`/easy-flowable/model/rollback/${historyId}`)
}