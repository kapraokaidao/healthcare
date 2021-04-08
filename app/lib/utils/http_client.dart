import 'dart:async';
import 'dart:core';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime_type/mime_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HttpClient {
  // static final String baseUrl =
  //     'https://dev-healthcare-backend.kaoths.dev';
  static final String baseUrl = 'https://dev-healthcare-backend.kaoths.dev';

  static Future<Map<String, String>> _getDefaultHeader() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String token = prefs.getString('accessToken');

    Map<String, String> headers = {};

    if (token != null) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return headers;
  }

  static Future<Map<String, dynamic>> get(
      {@required String path,
      Map<String, dynamic> queryParams = const {}}) async {
    Map<String, dynamic> headers = await _getDefaultHeader();

    String query = queryParams.length > 0 ? '?' : '';
    queryParams.forEach((key, value) {
      query = query + key + "=" + value;
    });
    http.Response response =
        await http.get(Uri.parse(baseUrl + path + query), headers: headers);
    return json.decode(response.body);
  }

  static Future<String> getWithoutDecode(
      {@required String path,
      Map<String, dynamic> queryParams = const {}}) async {
    Map<String, dynamic> headers = await _getDefaultHeader();

    String query = queryParams.length > 0 ? '?' : '';
    queryParams.forEach((key, value) {
      query = query + key + "=" + value;
    });
    http.Response response =
        await http.get(Uri.parse(baseUrl + path + query), headers: headers);
    return response.body;
  }

  static Future<Map<String, dynamic>> post(
      String path, Map<String, dynamic> body) async {
    Map<String, dynamic> headers = await _getDefaultHeader();
    headers["content-type"] = "application/json";
    http.Response response = await http.post(Uri.parse(baseUrl + path),
        body: jsonEncode(body), headers: headers);
    if (response.statusCode >= 400) {
      dynamic data = json.decode(response.body);
      throw ("'HTTP ${data['statusCode']}: ${data['message']}'");
    }
    return response.body.isEmpty ? {} : json.decode(response.body);
  }

  static Future<Map<String, dynamic>> postMultipartRequest(
      {@required String path,
      Map<String, dynamic> body = const {},
      List<String> files = const []}) async {
    Uri uri = Uri.parse(baseUrl + path);
    http.MultipartRequest request = http.MultipartRequest('POST', uri);

    Map<String, dynamic> headers = await _getDefaultHeader();
    headers.forEach((key, value) {
      request.headers[key] = value;
    });

    body.forEach((key, value) {
      if (value is List) {
        for (int i = 0; i < value.length; i++) {
          request.fields[key + '[' + i.toString() + ']'] = value[i];
        }
      } else if (value is int || value is double) {
        request.fields[key] = value.toString();
      } else {
        request.fields[key] = value;
      }
    });

    List<Future<http.MultipartFile>> filePromises = files
        .map((filePath) => http.MultipartFile.fromPath('files', filePath,
            contentType: MediaType.parse(mime(filePath))))
        .toList();
    List<http.MultipartFile> multipartFiles = await Future.wait(filePromises);
    multipartFiles.forEach((multipartFile) {
      request.files.add(multipartFile);
    });
    http.StreamedResponse streamedResponse = await request.send();
    http.Response response = await http.Response.fromStream(streamedResponse);
    return json.decode(response.body);
  }

  static Future<http.Response> uploadKyc(
      {@required String type, @required String filePath}) async {
    Map<String, dynamic> body = {};
    String path = '/patient/upload/' + type;
    Uri uri = Uri.parse(baseUrl + path);
    http.MultipartRequest request = http.MultipartRequest('POST', uri);

    Map<String, dynamic> headers = await _getDefaultHeader();
    headers.forEach((key, value) {
      request.headers[key] = value;
    });

    Future<http.MultipartFile> filePromises = http.MultipartFile.fromPath(
        'image', filePath,
        contentType: MediaType.parse(mime(filePath)));
    http.MultipartFile multipartFile = await filePromises;
    request.files.add(multipartFile);
    http.StreamedResponse streamedResponse = await request.send();
    http.Response response = await http.Response.fromStream(streamedResponse);
    if (response.statusCode >= 400) {
      dynamic data = json.decode(response.body);
      throw ("'HTTP ${data['statusCode']}: ${data['message']}'");
    }
    return response;
  }

  static Future<Map<String, dynamic>> put(
      String path, Map<String, dynamic> body) async {
    Map<String, dynamic> headers = await _getDefaultHeader();
    http.Response response =
        await http.put(Uri.parse(baseUrl + path), body: body, headers: headers);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> patch(
      String path, Map<String, dynamic> body) async {
    http.Response response =
        await http.patch(Uri.parse(baseUrl + path), body: body);
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> delete(
      String path, Map<String, dynamic> body) async {
    http.Response response = await http.delete(Uri.parse(baseUrl + path));
    return json.decode(response.body);
  }

  static Future<void> resetPassword(
      {@required String nationalId,
      @required String newPassword,
      @required String nationalIdFilePath,
      @required String selfieFilePath}) async {
    Map<String, dynamic> body = {};
    body["username"] = nationalId;
    body["newPassword"] = newPassword;
    http.Response response = await http
        .post(Uri.parse(baseUrl + '/patient/password/reset'), body: body);
    if (response.statusCode >= 400) {
      dynamic data = json.decode(response.body);
      throw ("'HTTP ${data['statusCode']}: ${data['message']}'");
    }
    final decoded = json.decode(response.body);
    final int rpid = decoded['resetPasswordId'];
    await uploadResetPasswordKyc(
        id: rpid, type: 'national-id', filePath: nationalIdFilePath);
    await uploadResetPasswordKyc(
        id: rpid, type: 'selfie', filePath: selfieFilePath);
  }

  static Future<http.Response> uploadResetPasswordKyc(
      {@required int id,
      @required String type,
      @required String filePath}) async {
    String path = "/patient/password/reset/$id/upload/" + type;
    Uri uri = Uri.parse(baseUrl + path);
    http.MultipartRequest request = http.MultipartRequest('POST', uri);
    Future<http.MultipartFile> filePromises = http.MultipartFile.fromPath(
        'image', filePath,
        contentType: MediaType.parse(mime(filePath)));
    http.MultipartFile multipartFile = await filePromises;
    request.files.add(multipartFile);
    http.StreamedResponse streamedResponse = await request.send();
    http.Response response = await http.Response.fromStream(streamedResponse);
    if (response.statusCode >= 400) {
      dynamic data = json.decode(response.body);
      throw ("'HTTP ${data['statusCode']}: ${data['message']}'");
    }
    return response;
  }
}
