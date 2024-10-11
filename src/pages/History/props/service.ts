import { request } from "@umijs/max";

export async function pageQuery(params: any) {
	return request(`/easy-flowable/model/historyPage`, {
		method: 'POST',
		data: params
	})
}