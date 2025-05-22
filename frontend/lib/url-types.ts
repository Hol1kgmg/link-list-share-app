// URLのバリエーション zennやqiitaなどのURLタイプを定義
export enum UrlType {
  ZENN = 'zenn',
  QIITA = 'qiita',
  SPEAKERDECK = 'speakerdeck',
  other = 'other',
}
// URLのバリエーションのマッピング
export const urlTypeMap: Record<string, UrlType> = {
  'zenn.dev': UrlType.ZENN,
  'qiita.com': UrlType.QIITA,
  'speakerdeck.com': UrlType.SPEAKERDECK,
  'other': UrlType.other,
};
// URLのバリエーションの正規表現
export const urlTypeRegex: Record<UrlType, RegExp> = {
  [UrlType.ZENN]: /zenn\.dev/,
  [UrlType.QIITA]: /qiita\.com/,
  [UrlType.SPEAKERDECK]: /speakerdeck\.com/,
  [UrlType.other]: /other/,
};