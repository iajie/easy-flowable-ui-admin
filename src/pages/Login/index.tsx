import logo from '@/assets/logo.png';
import { login } from '@/utils/easy-flowable.service';
import { LoginFormPage, ProConfigProvider, ProFormText } from "@ant-design/pro-components";

export default () => {

	const onLogin = async (values) => {
		const res = await login(values);
		if (res.success) {
			sessionStorage.setItem('username', values.username);
			window.location.href = '/';
		}
	}

	return <div style={{ height: '100vh' }}>
		<ProConfigProvider dark>
			<LoginFormPage
				onFinish={onLogin}
				backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
				title="Easy-Flowable"
				logo={logo}
				containerStyle={{
					backgroundColor: 'rgba(0, 0, 0,0.65)',
					backdropFilter: 'blur(4px)'
				}}
				activityConfig={{
					style: {
						boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
						borderRadius: 8,
						backgroundColor: 'rgba(255,255,255,0.25)',
						backdropFilter: 'blur(4px)'
					},
					title: 'Easy-Flowable',
					action: '联系方式：ajie20999@163.com'
				}}>
				<ProFormText
					label="登录账号"
					name="username"
					placeholder="登录名..."
					fieldProps={{ size: 'large' }}
					rules={[ { required: true, message: '请输入登录账号' } ]}/>
				<ProFormText.Password
					label="登录密码"
					name="password"
					placeholder="密码"
					fieldProps={{ size: 'large' }}
					rules={[ { required: true, message: '请输入密码' } ]}/>
			</LoginFormPage>
		</ProConfigProvider>
	</div>;
}