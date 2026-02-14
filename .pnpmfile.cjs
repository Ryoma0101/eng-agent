function readPackage(pkg, context) {
  // これはビルドスクリプト警告を抑制するためのポリシー設定
  // Firebase、MSW、protobufのビルドスクリプトを許可
  if (
    pkg.name === '@firebase/util' ||
    pkg.name === 'msw' ||
    pkg.name === 'protobufjs'
  ) {
    // パッケージのビルドを許可
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
