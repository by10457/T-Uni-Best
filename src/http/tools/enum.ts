export enum ResultEnum {
  // 0和200当做成功都很普遍，这里直接兼容两者（PS：0和200通常都不会当做错误码，但是有的接口会返回0，有的接口会返回200）
  Success0 = 0, // 成功
  Success200 = 200, // 成功
  Error = 400, // 错误
  Unauthorized = 401, // 未授权
  Forbidden = 403, // 禁止访问（原为forbidden）
  NotFound = 404, // 未找到（原为notFound）
  MethodNotAllowed = 405, // 方法不允许（原为methodNotAllowed）
  RequestTimeout = 408, // 请求超时（原为requestTimeout）
  InternalServerError = 500, // 服务器错误（原为internalServerError）
  NotImplemented = 501, // 未实现（原为notImplemented）
  BadGateway = 502, // 网关错误（原为badGateway）
  ServiceUnavailable = 503, // 服务不可用（原为serviceUnavailable）
  GatewayTimeout = 504, // 网关超时（原为gatewayTimeout）
  HttpVersionNotSupported = 505, // HTTP版本不支持（原为httpVersionNotSupported）
}
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
/**
 * 根据状态码，生成对应的错误信息
 * @param {number|string} status 状态码
 * @returns {string} 错误信息
 */
export function ShowMessage(status: number | string): string {
  let message: string
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}

export enum ResultCodeEnum {
  // ==================== 通用成功 ====================
  Success = 2000,
  CreateSuccess = 2001,
  UpdateSuccess = 2002,
  DeleteSuccess = 2003,
  SortSuccess = 2004,
  UploadSuccess = 2005,
  LogoutSuccess = 2006,

  // ==================== 认证/会话 (Token 失效) ====================
  LoginAuth = 3200,
  AuthenticationExpired = 3201,
  SessionExpiration = 3202,
  
  // ==================== 权限/Token (Token 失效) ====================
  TokenParsingFailed = 3302,
  TokenExpired = 3303,
  TokenNotProvided = 3304,
  RefreshTokenEmpty = 3305,
  RefreshTokenInvalid = 3306,
  RefreshTokenExpired = 3307,
  AccessTokenEmpty = 3308,
  AccessTokenInvalid = 3309,
}

/**
 * 判断是否为业务成功
 */
export function isSuccessCode(code: number | string): boolean {
  const c = Number(code)
  return c === ResultEnum.Success0 || c === ResultEnum.Success200 || (c >= 2000 && c <= 2099)
}

/**
 * 判断是否为 Token 失效/未授权，需要重新登录或无感刷新
 */
export function isTokenExpiredCode(code: number | string): boolean {
  const c = Number(code)
  return c === ResultEnum.Unauthorized || [
    ResultCodeEnum.LoginAuth,
    ResultCodeEnum.AuthenticationExpired,
    ResultCodeEnum.SessionExpiration,
    ResultCodeEnum.TokenParsingFailed,
    ResultCodeEnum.TokenExpired,
    ResultCodeEnum.TokenNotProvided,
    ResultCodeEnum.RefreshTokenEmpty,
    ResultCodeEnum.RefreshTokenInvalid,
    ResultCodeEnum.RefreshTokenExpired,
    ResultCodeEnum.AccessTokenEmpty,
    ResultCodeEnum.AccessTokenInvalid
  ].includes(c)
}
