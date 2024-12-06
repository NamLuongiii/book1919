# Epub là một chuẩn sách điện tử

- Một Epub Publication là một tập hợp files được đóng gói vào 1 file zip
- Tệp Epub giúp cho tác giả hoặc đơn vị xuất bản đưa tác phẩm của mình lên không gian số
- Epub là một tiêu chuẩn để định nghĩa một ấn phẩm vật lý thành ấn phẩm điện tử, bao gồm các hướng dẫn và các quy tắc để tạo ra các ấn bản số , cũng như
  các phầm mềm đọc sách điện tử
- Epub dựa trên những công nghệ Web và một số công nghệ khác để định nghĩa một ấn phẩm sách bao gồm chuẩn Html xác định cấu trúc của sách, chuẩn Css cung cấp khả năng trang trí, SVG, MATH ML, công nghệ Zip, chuẩn đóng gói OCF, ...
- Epub là một định dạng phổ biến để tạo sách điện tử

# Tạo một trình đọc file epub

## Phân giải file zip

- Cần giải mã file zip thành tập hợp các file, đây chính là các file ban đầu do người tạo epub xây dựng lên, việc giải nén file zip luôn cho ta 1 folder
  , bên trong folder gồm các file và folder con, ta cần phân tích các file này với đúng định dạng của nó để tiếp tục xử lý

Cấu trúc file và directory

- [Folder]

  - mimetype [required]
  - [Folder] META-INF [required]
    -- container.xml [required]

- mimetype là 1 file được mã hóa bằng định dạng US-ASCII, nội dung bắt buộc trong file này phải là [application/epub+zip]
  file này giúp xác định rằng file zip đang xét đến tuân theo tiêu chuẩn Epub, Reading System nên đọc file này đầu tiên để validate tệp zip

- container.xml chứa thông tin về một hoặc nhiều package-document, đường dẫn href là một trong số các thông tin, giúp Reading System tìm tới package-document

- Cần xác định được cấu trúc bên trong các file để phân tích đúng, trình Reading System cần phân tích thông tin trong 3 file bắt buộc đầu tiên để thao tác

## Phân tích dữ liệu theo chuẩn đóng gói của Epub

# Thuật ngữ

Reading System

- Trình đọc file epub

Epub Publication

- Một file epub, một ấn bản sách điện tử

Viewport

- Thuộc về Reading System chỉ vùng hiển thị một Epub Publication

Package Document

- Là các file có đuôi opf, có định dạng mã hóa là XML, trong đó đóng gói thông tin về Epub Publication, gồm metadata, spine , manifest
  , trình Reading System sẽ dựa vào thông tin trong file này để thao tác như hiển thị các chương sách theo thứ tự, lấy thông tin tác giả, tên sách ,...

Epub Creator

- Là người chuyển sách vật lý thành ấn phẩm số , Epub Creator không nhất thiết phải là Book Author

Publication Resource

- Chỉ content nội dung trong Epub Publication mà Reading System sử dụng để trình bày cuốn sách

# Expresing Structural Semantic

- Chỉ một attribute [epub:type] có value là đươc định nghĩa sẵn, Epub creator có thể tự định nghĩa value mới nhưng khuyến nghị nên sử dụng danh sách
  đã chuẩn hóa vì mục đích hỗ trợ rộng bởi các trình Reading System

- Epub:type thêm thông tin cho các thẻ XHTML

# Phân tích file Package Document

- Media-Type là application/xhtml+xml
- File Extension là .opf

- dir attribute có 1 trong các giá trị [ltr|rtl|auto]. Nó đại diện cho base direction của các chữ cái trong Epub Publication
  Khi Epub Creator không đặt giá trị dir hoặc giá trị không hợp lệ thì Reading System có thể sử dụng auto như giá trị mặc định

- href attribute là đường dẫn tới Resource, href là đường dẫn tương đối với vị trí của Package Document

- id attribute
- media-type attribute
- properties attribute
- refines attribute

- Package Element là thẻ </package> thẻ này đóng vai trò root trong file Package Document
  thẻ này có attributes sau [dir, id, prefix, xml:lang, unique-identifier, version], trong đó unique-identifier và version là required
  version chỉ tiêu chuẩn Epub được áp dụng ví dụ như với chuẩn Epub 3 ta có version='3.0'

- Cấu trúc:

```mxl
<package>
  <metadata>
    <dc:identifier />
    <dc:title />
    <dc:language />
    <meta />
  </metadata>

  <manifest />

  <spine />
</package>
```

## Phân tích section Metadata

- Yêu cầu phải là First Child Element của thẻ <package />

- Như tên gọi metadata chứa thông tin meta để Reading System sử dụng
  Các thông tin này là title, author, ...

Các thẻ bắt buộc có trong thẻ metadata
<dc:identifier />
<dc:title />
<dc:language />

Các thẻ optional có trong thẻ metadata
<dc:contributor>
<dc:creator>
<dc:date>
<dc:subject>
<dc:type>

## Phân tích Manifest

- Yêu cầu phải là Second Child Element của thẻ <package />
- Manifest cung cấp 1 danh sách đẩy đủ tất cả Publication Resource trong Epub Publication

- Mỗi <item id media-type href /> đại diện cho 1 Publication Resource

- Sau đây là các attribute có thể item có:

  fallback [conditionally required]
  href [required]
  id [required]
  media-overlay [optional]
  media-type [required]
  properties [optional]

- Reading System có thể tìm cover image bằng cách tìm <item /> có attribute sau [properties="cover-image"]
- Tương tự tìm Epub Navigation Document bằng cách tìm <item /> có attribute [properties="nav"]

## Spine

- Yêu cầu phải là Third Child Element của thẻ <package />
- Thẻ này chứa các Item-Ref theo Reading-Order

- Thẻ này có các Attributes sau:

id [optional]
page-progression-direction [optional]
toc [optional] (legacy)

- toc chứa id tới <item /> trong <manifest />, cuối cùng tìm được NCX document, NCX tương tự như Epub Navigation Document nhưng là tiêu chuẩn Epub 2
  Trong đó ở Epub 3 nó bị loại bỏ và thay thế bằng Epub Navigation Document
  Reading System nên hỗ trợ NCX

<itemref /> có các attributes sau:
id [optional]
idref [required]
linear [optional]
properties [optional]

Thuộc tính [idref] sẽ tham chiếu tới attribute [id] trong <item /> của <manifest />

# Phân tích EPUB navigation document
