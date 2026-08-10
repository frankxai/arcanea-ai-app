import type { VisualMedia } from './schema';

type FoundationMediaReceipt = Pick<
  VisualMedia,
  'status' | 'width' | 'height' | 'mimeType' | 'sha256'
>;

const receipt = (sha256: string, width = 1254, height = 1254): FoundationMediaReceipt => ({
  status: 'generated',
  width,
  height,
  mimeType: 'image/png',
  sha256,
});

/** Hash and dimension receipts recomputed from the 30 approved Wave 01 master PNGs. */
export const FOUNDATION_MEDIA: Record<string, FoundationMediaReceipt> = {
  K01: receipt('8a19853125b0bbf6838f3e395aab58ece1dbb56fb50396c3e6cfaa9894b19f68'),
  K02: receipt('cf968eff253bdd4311f90596ceaa669d45ae944f78184efb952a4df023d6dfb8'),
  K03: receipt('b95116cea1ab75a3d0652483e95e92a6670c1d5e66ba16bb4e9d5126dd4ed3b1'),
  K04: receipt('7b1fa78fc9dd5262c01d2561d35f37694856f1a6ef24ecca343d45ff93a03ba1'),
  K05: receipt('d261976caa9dce10e66bd6414fe6936d7e2c673fd51643adf9fff51845b66c29'),
  K06: receipt('05365519f1c56551f48f71594a9f6cd72bc97a812b57f458b6b67140f557a6e5'),
  K07: receipt('f5b25f3b70010f10ff5abe19f536d778494203c82c2b516ddff9f8d047ce9297'),
  K08: receipt('740c28776984ada82197a1482c8bfc985e6ca8b0041b19c4f17f713e7f0323cb'),
  K09: receipt('a08909783cda09573974c0a38ce622a8a9cc9bd4264ea8311ee8ef2d49944e51'),
  K10: receipt('584227156dbd19c3b5eb1944be172b4ad64b517aa23d0715e9146a9e6020df27'),
  K11: receipt('7e742f6f3d706725430858808bb36a791cffc75f521757c682b6d8afd9528cad'),
  K12: receipt('3e43b0834cea184ccce801b0ff2f9b70077ef559214981270dd3afa67f0c6025'),
  C13: receipt('e9c921ccbe67d4b57246c1bad302e7c4cc26b1da763e6ab0199344d2206cf2b2'),
  C14: receipt('c594014384a9ad5712502d15e352a01dd16b92519a561714e921de7494f52bca'),
  C15: receipt('f73863865677af60cb4f826559f267f833efac84dca15afa5ccf6e8525f516a6'),
  C16: receipt('89697198896e33fea71fe09c8114787a5beb2b46788c937131e7f7624893180f'),
  C17: receipt('8c02408ef8fda61fb0ddb9b0c9aa4c802e1532baf34d9a530d150b2e56fbbd43'),
  C18: receipt('a165d31a3cb15500dcda6fedfc2a5d0bd024bc90b90a4f5eab41df19b112cb4b'),
  C19: receipt('471d4fcbcf38b91b7e394c9397e91e855b6cd6617dc7112f9ff13e70fae1059c'),
  C20: receipt('ba54a0ebcd0ae94989091b1d942e3e3795e994de92ae45f70f860f79d1f135f5'),
  B21: receipt('647ce880bd97d3e0a2b576688124220ebe9de5f0101a4184a0c556207717e94c'),
  B22: receipt('be97294f6e4dbe189f696c0bd2f6a6276cbf4216b4c3698b4e8087fd98599224'),
  B23: receipt('b02f94da338a479c2d75430d8e92a357a2373dfd9142c58d52a6a968f7debed0'),
  B24: receipt('fb4def8c04678b02d751f6f156eababdc742bac7422a0120fa95996805a93815'),
  B25: receipt('7401a531cfec75cded88526d53ce08f267cd12675c41d1622b22eaed5aec907e'),
  S26: receipt('4909d7c220441500dd8df550f6acaa9dd0db7e05ac121697d708e2a1eb54a992'),
  S27: receipt('17c2f634aefb9d06fb3e757dc26dd15311ffe35e610950e7d5389628c4dee8e0'),
  S28: receipt('f2467a36ea7c32b3322080edf759902cd831823cd810a0ad2bd5d596be625363'),
  S29: receipt('aef3f0673e96bf707aa805d97330c3dc3d7af68946174ff197579a7ec1c78733'),
  S30: receipt('70759f840abed8e6503e5f8361fc0d32a126313abdd5621bd0cb55a47eaf71cc'),
};
